/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Entity } from '../../common/datamodel/Entity';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class EntityPersistable extends Entity implements Persistable {

    public static readonly tableName: string = 'entities';

    public getTableName() : string {
        return EntityPersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : EntityPersistable {
        this.deserialize(data);
        return this;
    }
}

export class EntityController extends GenericController<EntityPersistable> {
    constructor(db : Database) {
        super(db, EntityPersistable.tableName);
    }
}