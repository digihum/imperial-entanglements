/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import { Entity, Serializer, Record } from '@digihum/falcon-core';
import { AppUrls } from '../../common/ApiService';

import { knex, api } from './testHelper';

import { InvalidUpdateException, ReadOnlyResourceException, OperationNotPermittedException } from '../../common/Exceptions';

export const entityTests = (chai) => {

    describe('Entity', () => {

      it('checking that 3 entities have been seeded', async () => {
        const result = await api.getCollection(Entity, AppUrls.entity, {});
        chai.expect(result.length).to.equal(3);
      });

      it('adding a new entity', async () => {

        const newEntity = Serializer.fromJson(Entity, {
          label: 'Test 1',
          entityType: 1
        });

        const result = await api.postItem(Entity, AppUrls.entity, newEntity, {});
        chai.expect(result.length).to.equal(1);
        chai.expect(result[0]).to.equal(4);
      });

      it('checking that there are now 4 entities', async () => {
        const result = await api.getCollection(Entity, AppUrls.entity, {});
        chai.expect(result.length).to.equal(4);
      });

      it('updating the name of new entity using patch', async () => {
        await api.patchItem(Entity, AppUrls.entity, 4, { label: 'Test 1 Updated'});
      });

      it('check name was updated', async () => {
        const result = await api.getItem(Entity, AppUrls.entity, 4);
        chai.expect(result.label).to.equal('Test 1 Updated');
      });

      it('attempt to update uid (should fail)', async () => {
        try {
          await api.patchItem(Entity, AppUrls.entity, 4, { uid: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      it('attempt to update non-existent field (should fail)', async () => {
        try {
          await api.patchItem(Entity, AppUrls.entity, 4, { banana: 23 });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as InvalidUpdateException).code).to.equal(400);
        }
      });

      xit('attempt to modify locked item (should fail)', async () => {

        await knex('entities').update({ readonly: 1 }).where({ uid: 4 }).then(() => {});

        try {
          await api.patchItem(Entity, AppUrls.entity, 4, { label: 'Should not work' });
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      xit('attempt to delete locked item (should fail)', async () => {

        await knex('entities').update({ readonly: 1 }).where({ uid: 4 }).then(() => {});

        try {
          await api.delItem(Entity, AppUrls.entity, 4);
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          console.log(err);
          chai.expect((err as ReadOnlyResourceException).code).to.equal(400);
        }

      });

      it('attempt to delete unlocked item', async () => {
        await knex('entities').update({ readonly: 0 }).where({ uid: 4 }).then(() => {});
        await api.delItem(Entity, AppUrls.entity, 4);
      });

      it('checking that there are now 3 entities', async () => {
        const result = await api.getCollection(Entity, AppUrls.entity, {});
        chai.expect(result.length).to.equal(3);
      });

      it('add relationship record', async () => {
        const newRecord = Serializer.fromJson(Record, {
          entity: 1,
          predicate: 2,
          value: 2,
          valueType: 'entity'
        });

        const result = await api.postItem(Record, AppUrls.record, newRecord, {});
        chai.expect(result.length).to.equal(1);
        chai.expect(result[0]).to.equal(1);
      });

      it('attempt to delete related item (should fail)', async () => {

        try {
          await api.delItem(Entity, AppUrls.entity, 2);
          chai.assert(false, 'an error should have been thrown');
        } catch (err) {
          chai.expect((err as OperationNotPermittedException).code).to.equal(422);
        }

      });

      it('delete the relationship record', async () => {
        await api.delItem(Record, AppUrls.record, 1);
      });

      it('attempt to delete unlocked item', async () => {
        await api.delItem(Entity, AppUrls.entity, 2);
      });

      it('checking that there are now 2 entities', async () => {
        const result = await api.getCollection(Entity, AppUrls.entity, {});
        chai.expect(result.length).to.equal(2);
      });

    });
};
