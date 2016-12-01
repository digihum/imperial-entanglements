/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Entity, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

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

    public getCollectionJson(obj: { new(): Entity; }, params: any = {}) : PromiseLike<Entity[]>  {
        if (params.type !== undefined) {
            return this.db.getChildrenOf(isArray(params.type) ? params.type[0] : params.type, 'entity_types')
            .then((ancestors) => {
                return this.db.select('entities').whereIn('type', ancestors)
                .then((results) => results.map((result) => this.fromSchema(result)));
            });
        } else {
            return super.getCollectionJson(obj, params);
        }
    }

    public deleteItem(obj: { new(): Entity; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.select(this.tableName).where('parent', '=', uid),
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
