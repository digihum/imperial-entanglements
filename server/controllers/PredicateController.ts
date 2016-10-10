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
        if (data.range_ref !== null) {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        } else {
            data.range = data.range_val;
            data.rangeIsReference = false;
        }
        this.deserialize(data);
        return this;
    }
}

export class PredicateController extends GenericController<PredicatePersistable> {
    constructor(db : Database) {
        super(db, PredicatePersistable.tableName);
    }

// SELECT predicates.uid, description, same_as, domain, readonly, predicates_ref.range as 'range_ref', predicates_val.range as 'range_val'
// FROM predicates
// LEFT JOIN predicates_ref ON predicates.uid = predicates_ref.uid
// LEFT JOIN predicates_val ON predicates.uid = predicates_val.uid;

    public getItemJson(obj: { new(): PredicatePersistable; }, uid: number) : Promise<PredicatePersistable> {

        const fields = [
            'predicates.uid',
            'name',
            'description',
            'same_as',
            'domain',
            'readonly',
            'predicates_ref.range as range_ref',
            'predicates_val.range as range_val'];

        const query = this.db.query().select(fields)
            .from(this.tableName)
            .leftJoin('predicates_ref', 'predicates.uid', '=', 'predicates_ref.uid')
            .leftJoin('predicates_val', 'predicates.uid', '=', 'predicates_val.uid')
            .where({ 'predicates.uid': uid })
            .first();

        return query.then((data) => new obj().fromSchema(data));
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