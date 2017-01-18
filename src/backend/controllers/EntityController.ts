/**
 * @fileOverview Controller for entities
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */

import { Database } from '../data/Database';

import { Entity, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { OperationNotPermittedException, InvalidUpdateException } from '../../common/Exceptions';

import { omit, isArray } from 'lodash';

export class EntityController extends GenericController<Entity> {

    constructor(db : Database) {
        super(db, 'entities');
    }

    public static fromSchema(data: any) : Entity {
        return Object.assign(Object.create(Entity.prototype), {
            entityType: data.type,
            uid: data.uid,
            label: data.label,
            parent: data.parent
        });
    }

    public static toSchema(data: Entity) : any {

      const allowedKeys = new Set(['uid', 'label', 'entityType', 'parent', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
      const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));

      if (extraKeys.length > 0) {
        throw new InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
      }

      return Object.assign(omit(Serializer.toJson(data),
          'entityType',
          'creationTimestamp',
          'lastmodifiedTimestamp'), {
          type: data.entityType,
          creation_timestamp: data.creationTimestamp,
          lastmodified_timeStamp: data.lastmodifiedTimestamp
      });
    }

    protected fromSchema(data: any) : Entity {
        return EntityController.fromSchema(data);
    }

    protected toSchema(data: Entity) : any {
       return EntityController.toSchema(data);
    }

    public async getCollectionJson(obj: { new(): Entity; }, params: any = {}) : Promise<Entity[]>  {
        if (params.type !== undefined) {

          const ancestorTypes = await this.db.getChildrenOf(isArray(params.type) ? params.type[0] : params.type, 'entity_types');

          return this.db.select('entities')
            .whereIn('type', ancestorTypes)
            .then((rawEntities) => rawEntities.map((entity) => this.fromSchema(entity)));

        } else {
            return super.getCollectionJson(obj, params);
        }
    }

    public async postItem(obj: { new(): Entity; }, data: Entity, params: any) : Promise<any> {
      const result = await this.db.createItem(this.tableName, this.toSchema(data));
      if (params.clone !== undefined) {
        const recordsToClone = await this.db.query()('records').where({ entity: params.clone })
          .then((records) => records.map((record) => ({...record, entity: result[0], uid: undefined})));

        await this.db.query()('records').insert(recordsToClone).then(() => {});
      }
      return result;
    }


    public async deleteItem(obj: { new(): Entity; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.

        const [entities, records] = await Promise.all([
          this.db.select(this.tableName).where('parent', '=', uid),
          this.db.select('records').where('value_entity', '=', uid)
        ]);

        if (entities.length + records.length === 0) {
            return this.db.deleteItem(this.tableName, uid);
        } else {
            throw new OperationNotPermittedException({
                message: 'The operation could not be completed as the entity is referenced in other sources',
                data: Promise.resolve({
                    entity: entities,
                    record: records
                })
            });
        }
    }
}
