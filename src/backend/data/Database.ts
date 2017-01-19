/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */


import * as Knex from 'knex';
import { omit } from 'lodash';

import { KeyNotFoundException, DatabaseIntegrityError } from '../../common/Exceptions';

export class Database {

    private knex : Knex;
    private dbType : string;

    constructor(config: Knex.Config) {
        this.knex = Knex(config);
        this.dbType = config.client!;
    }

    public query() : Knex {
        return this.knex;
    }

    public select(tableName: string, options: string[] | '*' = '*') {
        return this.knex.select().from(tableName);
    }

    public loadItem(a: string, uid: number) : Promise<any> {
        const query = this.knex.select()
            .from(a)
            .where({ uid: uid })
            .first();

        return query.then((result) => result === undefined ? Promise.reject(new KeyNotFoundException()) : result);
    }

    public loadCollection(a: string, params: Object) : Promise<any[]> {
        let query = this.knex.select()
            .from(a);

        Object.keys(params).forEach((param) => {
            query = query.whereIn(param, params[param]);
        });

        return query.then((results) => results === undefined ? Promise.reject(new KeyNotFoundException()) : results);
    }

    public createItem(tableName: string, data: any) : Promise<any> {
        // throw warning if called with uid
        // validate that everything else has been sent
        const withoutUid = omit(data, ['uid']);

        return this.knex.transaction((trx) => {
            return this.knex(tableName).transacting(trx).insert(withoutUid, 'uid').returning('uid')
            .then((results) => {
                return this.checkIntegrity(trx)
                .then((valid) => {
                    if (!valid) {
                        throw new DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }

    public updateItem(tableName: string, data: any) : Promise<any> {
        // assert - must have uid
        // validation?
        return this.knex.transaction((trx) => {
            return this.knex(tableName).transacting(trx)
            .where({ 'uid': data.uid })
            .update(data)
            .then((results) => {
                return this.checkIntegrity(trx)
                .then((valid) => {
                    if (!valid) {
                        throw new DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }

    public deleteItem(tableName: string, uid: number) : Promise<any> {

        return this.knex.transaction((trx) => {
            return this.knex(tableName).transacting(trx)
            .where({ uid })
            .del()
            .then((results) => {
                return this.checkIntegrity(trx)
                .then((valid) => {
                    if (!valid) {
                        throw new DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }

    public getAncestorsOf(uid: number, tableName: string) : Promise<number[]> {
        return this.knex.raw(`
            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
                ancestor(uid) AS (
                SELECT parent FROM parent_of WHERE uid=${uid}
                UNION ALL
                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
				SELECT * from ancestor`)
            .then((result) => {
              if (this.dbType === 'pg') {
                result = result.rows;
              }
                return result.filter((a) => a.uid !== null).map((a) => a.uid);
            });
    }

    public getChildrenOf(uid: number, tableName: string) : Promise<number[]> {
        return this.knex.raw(`
            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
                ancestor(parent) AS (
                SELECT uid FROM parent_of WHERE uid=${uid}
                UNION ALL
                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
				SELECT * from ancestor`)
            .then((result) => {
              if (this.dbType === 'pg') {
                result = result.rows;
              }
              return result.filter((a) => a.parent !== null).map((a) => a.parent);
            });
    }

    public checkIntegrity(trx: Knex.Transaction) : Promise<boolean> {

      const toInt = this.dbType === 'pg' ? '::int' : '';

        return Promise.all([
            this.knex.transacting(trx).select(this.knex.raw(`SUM((records.value_type != predicates.range_type)${toInt}) AS valid`))
            .from('records')
            .innerJoin('predicates', 'records.predicate', 'predicates.uid'),

            this.knex.transacting(trx).select(this.knex.raw(`
                SUM((

                entities.type not in (
                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                                ancestor(parent) AS (
                                SELECT uid FROM parent_of WHERE uid=predicates.range_ref
                                UNION ALL
                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
                                SELECT * from ancestor
                )

                )${toInt}) as valid
            `))
            .from('records')
            .innerJoin('predicates', 'records.predicate', 'predicates.uid')
            .innerJoin('entities', 'entities.uid', 'records.value_entity')
            .where('records.value_type', '=', 'entity'),

            this.knex.transacting(trx).select(this.knex.raw(`
               SUM((

                entities.type not in (
                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
                                ancestor(parent) AS (
                                SELECT uid FROM parent_of WHERE uid=predicates.domain
                                UNION ALL
                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
                                SELECT * from ancestor
                )

                )${toInt}) as valid
            `))
            .from('records')
            .innerJoin('predicates', 'records.predicate', 'predicates.uid')
            .innerJoin('entities', 'entities.uid', 'records.entity')

          ]).then(([[a], [b], [c]]) => {
            return (parseInt(a.valid) + parseInt(b.valid) + parseInt(c.valid)) === 0;
        });
    }
}
