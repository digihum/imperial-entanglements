/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const Knex = require("knex");
const lodash_1 = require("lodash");
const Exceptions_1 = require("../../common/Exceptions");
class Database {
    constructor(config) {
        this.knex = Knex(config);
        this.dbType = config.client;
    }
    query() {
        return this.knex;
    }
    select(tableName, options = '*') {
        return this.knex.select().from(tableName);
    }
    loadItem(a, uid) {
        const query = this.knex.select()
            .from(a)
            .where({ uid: uid })
            .first();
        return query.then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result);
    }
    loadCollection(a, params) {
        let query = this.knex.select()
            .from(a);
        Object.keys(params).forEach((param) => {
            query = query.whereIn(param, params[param]);
        });
        return query.then((results) => results === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : results);
    }
    createItem(tableName, data) {
        // throw warning if called with uid
        // validate that everything else has been sent
        const withoutUid = lodash_1.omit(data, ['uid']);
        return this.knex.transaction((trx) => {
            return this.knex(tableName).transacting(trx).insert(withoutUid, 'uid').returning('uid')
                .then((results) => {
                return this.checkIntegrity(trx)
                    .then((valid) => {
                    if (!valid) {
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }
    updateItem(tableName, data) {
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
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }
    deleteItem(tableName, uid) {
        return this.knex.transaction((trx) => {
            return this.knex(tableName).transacting(trx)
                .where({ uid })
                .del()
                .then((results) => {
                return this.checkIntegrity(trx)
                    .then((valid) => {
                    if (!valid) {
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    }
    getAncestorsOf(uid, tableName) {
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
    getChildrenOf(uid, tableName) {
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
    checkIntegrity(trx) {
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
            return (parseInt(a.valid === null ? 0 : a.valid) +
                parseInt(b.valid === null ? 0 : b.valid) +
                parseInt(c.valid === null ? 0 : c.valid) === 0);
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map