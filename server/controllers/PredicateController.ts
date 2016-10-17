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
            return super.getCollectionJson(obj, params);
        }
    }
}