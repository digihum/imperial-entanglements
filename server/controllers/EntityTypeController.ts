/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { EntityType } from '../../common/datamodel/EntityType';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class EntityTypePersistable extends EntityType implements Persistable {

    public static readonly tableName: string = 'entity_types';

    public getTableName() : string {
        return EntityTypePersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(), 'sameAs', 'parents'), {
            same_as: this.sameAs
        });
    }

    public fromSchema(data: any) : EntityTypePersistable {
        this.deserialize(Object.assign(data, {
            'sameAs': data.same_as
        }));
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

    public deleteItem(obj: { new(): EntityTypePersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.query()(EntityTypePersistable.tableName).select().where('parent', '=', uid),
            this.db.query()('entities').select().where('type', '=', uid),
            this.db.query()('predicates').select().where('domain', '=', uid).orWhere('range_ref', '=', uid)
        ]).then(([entityTypes, entities, predicates]) => {
            if (entities.length + entityTypes.length + predicates.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: entities.concat(entityTypes).concat(predicates)
                });
            }
        });
    }
}