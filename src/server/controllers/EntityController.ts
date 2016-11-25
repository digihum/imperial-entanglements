/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Entity } from '../../common/datamodel/Entity';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit, isArray } from 'lodash';

export class EntityPersistable extends Entity implements Persistable {

    public static readonly tableName: string = 'entities';

    public getTableName() : string {
        return EntityPersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(),
            'entityType',
            'creationTimestamp',
            'lastmodifiedTimestamp'), {
            type: this.entityType,
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : EntityPersistable {
        this.deserialize({
            entityType: data.type,
            uid: data.uid,
            label: data.label,
            parent: data.parent
        });
        return this;
    }
}

export class EntityController extends GenericController<EntityPersistable> {

    constructor(db : Database) {
        super(db, EntityPersistable.tableName);
    }

    public getCollectionJson(obj: { new(): EntityPersistable; }, params: any = {}) : PromiseLike<EntityPersistable[]>  {
        if (params.type !== undefined) {
            return this.db.getChildrenOf(isArray(params.type) ? params.type[0] : params.type, 'entity_types')
            .then((ancestors) => {
                return this.db.select('entities').whereIn('type', ancestors)
                .then((results) => results.map((result) => new obj().fromSchema(result)));
            });
        } else {
            return super.getCollectionJson(obj, params);
        }
    }

    public deleteItem(obj: { new(): EntityPersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.select(EntityPersistable.tableName).where('parent', '=', uid),
            this.db.select('records').where('value_entity', '=', uid)
        ]).then(([entities, records]) => {
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
        });
    }
}