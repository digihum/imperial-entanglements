/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Predicate } from '../../common/datamodel/Predicate';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class PredicatePersistable extends Predicate implements Persistable {

    public static readonly tableName: string = 'predicates';

    public getTableName() : string {
        return PredicatePersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(), 'range', 'rangeIsReference', 'sameAs'), { 'same_as': this.sameAs });
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

    private fields = [
            'predicates.uid',
            'name',
            'description',
            'same_as',
            'domain',
            'readonly',
            'predicates_ref.range as range_ref',
            'predicates_val.range as range_val'];


    constructor(db : Database) {
        super(db, PredicatePersistable.tableName);
    }

// SELECT predicates.uid, description, same_as, domain, readonly, predicates_ref.range as 'range_ref', predicates_val.range as 'range_val'
// FROM predicates
// LEFT JOIN predicates_ref ON predicates.uid = predicates_ref.uid
// LEFT JOIN predicates_val ON predicates.uid = predicates_val.uid;

    public getItemJson(obj: { new(): PredicatePersistable; }, uid: number) : Promise<PredicatePersistable> {

        const query = this.db.query().select(this.fields)
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
            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                ancestor(parent) AS (
                SELECT uid FROM parent_of WHERE uid=?
                UNION ALL
                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
                
                SELECT *
                FROM predicates
                WHERE predicates.domain IN ancestor;
            `, params.domain).then((results) => results.map((result) => new obj().fromSchema(result)));
        } else {
             const query = this.db.query().select(this.fields)
                .from(this.tableName)
                .leftJoin('predicates_ref', 'predicates.uid', '=', 'predicates_ref.uid')
                .leftJoin('predicates_val', 'predicates.uid', '=', 'predicates_val.uid');

            return query.then((data) => data.map((datum) => new obj().fromSchema(datum)));
        }
    }

    //TODO: it is concivable that the first insert will succeed and the second will fail, the first
    // should be rolled back in this case.
    public postItem(obj: { new(): PredicatePersistable; }, data: PredicatePersistable) : Promise<string> {
        return super.postItem(obj, data)
        .then(([id]) => {
            if (data.rangeIsReference) {
                return this.db.query().insert({ uid: id, range: data.range}).into('predicates_ref')
                .then(() => id);
            } else {
                return this.db.query().insert({ uid: id, range: data.range}).into('predicates_val')
                .then(() => id);
            }
        });
    }

    public patchItem(obj: { new(): PredicatePersistable; }, uid: number, data: PredicatePersistable) : Promise<boolean> {
        return super.patchItem(obj, uid, data)
        .then((result) => {
            if ('range' in data) {

                const tableExtension = data.range.toString().match(/[0-9]+/) ? 'ref' : 'val';

                return this.db.query().transaction((trx) =>

                    Promise.all([
                        trx.from('predicates_ref').where({ uid }).del(),
                        trx.from('predicates_val').where({ uid }).del()
                    ]).then(() =>
                        trx.from('predicates_' + tableExtension)
                        .insert({ uid, range: data.range })
                    )
                );
            }

            return result;
        });
    }
}