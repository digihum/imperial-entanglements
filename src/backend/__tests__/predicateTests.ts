/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import { Serializer, Record, Predicate } from 'falcon-core';
import { AppUrls } from '../../common/ApiService';

import { knex, api } from './testHelper';

import { InvalidUpdateException, ReadOnlyResourceException, OperationNotPermittedException } from '../../common/Exceptions';

export const predicateTests = (chai) => {

    describe('Predicate', () => {

      it('checking that 4 predicates have been seeded', async () => {
        const result = await api.getCollection(Predicate, AppUrls.predicate, {});
        chai.expect(result.length).to.equal(4);
      });

      it('adding a new predicate', async () => {

        const newPredicate = Serializer.fromJson(Predicate, {
          label: 'Test Predicate 1',
          domain: 0,
          range: 0
        });

        const result = await api.postItem(Predicate, AppUrls.predicate, newPredicate, {});
        chai.expect(result.length).to.equal(1);
        chai.expect(result[0]).to.equal(5);
      });

      it('checking that there are now 5 predicates', async () => {
        const result = await api.getCollection(Predicate, AppUrls.predicate, {});
        chai.expect(result.length).to.equal(5);
      });

      it('updating the name of new predicate using patch', async () => {
        await api.patchItem(Predicate, AppUrls.predicate, 5, { label: 'Test 1 Predicate Updated'});
      });

      it('check name was updated', async () => {
        const result = await api.getItem(Predicate, AppUrls.predicate, 5);
        chai.expect(result.label).to.equal('Test 1 Predicate Updated');
      });

      it('attempt to update uid (should fail)', async () => {
        try {
          await api.patchItem(Predicate, AppUrls.predicate, 5, { uid: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      it('attempt to update non-existent field (should fail)', async () => {
        try {
          await api.patchItem(Predicate, AppUrls.predicate, 5, { banana: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      xit('attempt to modify locked item (should fail)', async () => {

        await knex('predicates').update({ readonly: 1 }).where({ uid: 5 }).then(() => {});

        try {
          await api.patchItem(Predicate, AppUrls.predicate, 5, { label: 'Should not work' });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      xit('attempt to delete locked item (should fail)', async () => {

        await knex('predicates').update({ readonly: 1 }).where({ uid: 5 }).then(() => {});

        try {
          await api.delItem(Predicate, AppUrls.predicate, 5);
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      it('attempt to delete unlocked item', async () => {
        await knex('predicates').update({ readonly: 0 }).where({ uid: 5 }).then(() => {});
        await api.delItem(Predicate, AppUrls.predicate, 5);
      });

      it('checking that there are now 4 predicates', async () => {
        const result = await api.getCollection(Predicate, AppUrls.predicate, {});
        chai.expect(result.length).to.equal(4);
      });

      it('add relationship record', async () => {
        const newRecord = Serializer.fromJson(Record, {
          entity: 1,
          predicate: 3,
          value: 1,
          valueType: 'source'
        });

        const result = await api.postItem(Record, AppUrls.record, newRecord, {});
        chai.expect(result.length).to.equal(1);
        chai.expect(result[0]).to.equal(2);
      });

      it('attempt to delete related item (should fail)', async () => {

        try {
          await api.delItem(Predicate, AppUrls.predicate, 3);
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as OperationNotPermittedException).code).to.equal(422);
        }

      });

      it('delete the relationship record', async () => {
        await api.delItem(Record, AppUrls.record, 2);
      });

      it('attempt to delete unlocked item', async () => {
        await api.delItem(Predicate, AppUrls.predicate, 3);
      });

      it('checking that there is now 3 predicates', async () => {
        const result = await api.getCollection(Predicate, AppUrls.predicate, {});
        chai.expect(result.length).to.equal(3);
      });

    });
};
