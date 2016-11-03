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

import { omit } from 'lodash';

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

    public deleteItem(obj: { new(): EntityPersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.query()(EntityPersistable.tableName).select().where('parent', '=', uid),
            this.db.query()('records').select().where('value_entity', '=', uid)
        ]).then(([entities, records]) => {
            if (entities.length + records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: entities.concat(records)
                });
            }
        });
    }
}