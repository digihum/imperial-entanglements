/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { EntityType } from '../../common/datamodel/EntityType';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class EntityTypePersistable extends EntityType implements Persistable {

    public static readonly tableName: string = 'entity_types';

    public getTableName() : string {
        return EntityTypePersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(), 'sameAs'), {
            same_as: this.sameAs
        });
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

    // WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
	// ancestor(uid) AS (
	// SELECT parent FROM parent_of WHERE uid='26'
	// UNION ALL
	// SELECT parent FROM parent_of JOIN ancestor USING(uid) )
	
	// SELECT *
	// FROM entity_types
	// WHERE entity_types.uid in ancestor;

    public getItemJson(obj: { new(): EntityTypePersistable; }, uid: number) : Promise<EntityTypePersistable> {
        return super.getItemJson(obj, uid)
        .then((result) => {
            return this.db.query().raw(`
                WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                ancestor(uid) AS (
                SELECT parent FROM parent_of WHERE uid=?
                UNION ALL
                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
                
                SELECT *
                FROM entity_types
                WHERE entity_types.uid in ancestor;
            `, uid).then((parents) => {
                result.parents = parents;
                return result;
            });
        });
    }
}