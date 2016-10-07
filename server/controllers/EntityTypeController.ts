/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { EntityType } from '../../common/datamodel/EntityType';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class EntityTypePersistable extends EntityType implements Persistable {

    public static readonly tableName: string = 'entity_types';

    public getTableName() : string {
        return EntityTypePersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : EntityTypePersistable {
        this.deserialize(data);
        return this;
    }
}

export class EntityTypeController extends GenericController<EntityTypePersistable> {
    constructor(db : Database) {
        super(db, EntityTypePersistable.tableName);
    }
}