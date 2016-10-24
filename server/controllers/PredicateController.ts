/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Predicate } from '../../common/datamodel/Predicate';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class PredicatePersistable extends Predicate implements Persistable {

    public static readonly tableName: string = 'predicates';

    public getTableName() : string {
        return PredicatePersistable.tableName;
    }

    public toSchema() {
        const out : { [s: string] : any } = Object.assign(omit(this.serialize(), 'range', 'rangeIsReference', 'sameAs'), {
            'same_as': this.sameAs,
            'range_type': this.rangeIsReference ? 'ref' : 'val'
        });

        if (this.rangeIsReference) {
            out['range_ref'] = this.range;
            out['range_val'] = null;
        } else {
            out['range_val'] = this.range;
            out['range_ref'] = null;
        }

        return out;
    }

    public fromSchema(data: any) : PredicatePersistable {
        if (data.range_type === 'ref') {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        } else {
            data.range = data.range_val;
            data.rangeIsReference = false;
        }
        this.deserialize(Object.assign(data, {
            'sameAs': data.same_as
        }));
        return this;
    }
}

export class PredicateController extends GenericController<PredicatePersistable> {

    constructor(db : Database) {
        super(db, PredicatePersistable.tableName);
    }

    public getCollectionJson(obj: { new(): PredicatePersistable; }, params: any = {}) : Promise<PredicatePersistable[]>  {
        if (params.domain !== undefined) {
            return this.db.query().raw(`
            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                ancestor(uid) AS (
                SELECT parent FROM parent_of WHERE uid=:uid
                UNION ALL
                SELECT parent FROM parent_of JOIN ancestor USING(uid) ),
				currentType(uid) AS (
					SELECT uid from entity_types WHERE uid=:uid
					UNION ALL
					SELECT * from ancestor
				)
                
                SELECT *
                FROM predicates
                WHERE predicates.domain IN currentType
            `, {
                uid: params.domain
            }).then((results) => results.map((result) => new obj().fromSchema(result)));
        } else {
            return super.getCollectionJson(obj, params);
        }
    }

     public deleteItem(obj: { new(): PredicatePersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.query()('records').select().where('predicate', '=', uid)
        ]).then(([records]) => {
            if (records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the predicate is used by other records',
                    data: records
                });
            }
        });
    }
}