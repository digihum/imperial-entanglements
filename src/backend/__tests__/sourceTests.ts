/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import { Serializer, Source } from '@digihum/falcon-core';
import { AppUrls } from '../../common/ApiService';

import { knex, api } from './testHelper';

import { InvalidUpdateException, ReadOnlyResourceException, OperationNotPermittedException } from '../../common/Exceptions';

export const sourceTests = (chai) => {

    describe('Sources', () => {

      it('checking that 1 sourcehave been seeded', async () => {
        const result = await api.getCollection(Source, AppUrls.source, {});
        chai.expect(result.length).to.equal(1);
      });

      it('adding a new source', async () => {

        const newSource = Serializer.fromJson(Source, {
          label: 'Test Source 1'
        });

        const result = await api.postItem(Source, AppUrls.source, newSource, {});
        chai.expect(result.length).to.equal(1);
        chai.expect(result[0]).to.equal(2);
      });

      it('checking that there are now 2 sources', async () => {
        const result = await api.getCollection(Source, AppUrls.source, {});
        chai.expect(result.length).to.equal(2);
      });

      it('updating the name of new source using patch', async () => {
        await api.patchItem(Source, AppUrls.source, 2, { label: 'Test 1 Source Updated'});
      });

      it('check name was updated', async () => {
        const result = await api.getItem(Source, AppUrls.source, 2);
        chai.expect(result.label).to.equal('Test 1 Source Updated');
      });

      it('attempt to update uid (should fail)', async () => {
        try {
          await api.patchItem(Source, AppUrls.source, 2, { uid: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      it('attempt to update non-existent field (should fail)', async () => {
        try {
          await api.patchItem(Source, AppUrls.source, 2, { banana: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      xit('attempt to modify locked item (should fail)', async () => {

        await knex('sources').update({ readonly: 1 }).where({ uid: 2 }).then(() => {});

        try {
          await api.patchItem(Source, AppUrls.source, 2, { label: 'Should not work' });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      xit('attempt to delete locked item (should fail)', async () => {

        await knex('sources').update({ readonly: 1 }).where({ uid: 2 }).then(() => {});

        try {
          await api.delItem(Source, AppUrls.source, 2);
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      it('attempt to delete unlocked item', async () => {
        await knex('sources').update({ readonly: 0 }).where({ uid: 2 }).then(() => {});
        await api.delItem(Source, AppUrls.source, 2);
      });

      it('checking that there is now 1 source', async () => {
        const result = await api.getCollection(Source, AppUrls.source, {});
        chai.expect(result.length).to.equal(1);
      });

    });
};
