/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Predicate } from '../../common/datamodel/Predicate';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class PredicatePersistable extends Predicate implements Persistable {

    public static readonly tableName: string = 'predicates';

    public getTableName() : string {
        return PredicatePersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : PredicatePersistable {
        this.deserialize(data);
        return this;
    }
}

export class PredicateController extends GenericController<PredicatePersistable> {
    constructor(db : Database) {
        super(db, PredicatePersistable.tableName);
    }

    public getCollectionJson(obj: { new(): PredicatePersistable; }, params: any = {}) {
        if (params.domain !== undefined) {
            return this.db.query().raw(`
            WITH RECURSIVE parent_of(slug, parent) AS  (SELECT slug, parent FROM entity_types),
                ancestor(parent) AS (
                SELECT slug FROM parent_of WHERE slug=?
                UNION ALL
                SELECT slug FROM parent_of JOIN ancestor USING(parent) )
                
                SELECT *
                FROM predicates
                WHERE predicates.domain IN ancestor;
            `, params.domain).then((results) => results.map((result) => new obj().fromSchema(result)));
        } else {
            return super.getCollectionJson(obj, params);
        }
    }
}