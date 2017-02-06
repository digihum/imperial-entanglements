/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var Knex = require("knex");
var lodash_1 = require("lodash");
var Exceptions_1 = require("../../common/Exceptions");
var Database = (function () {
    function Database(config) {
        this.knex = Knex(config);
        this.dbType = config.client;
    }
    Database.prototype.query = function () {
        return this.knex;
    };
    Database.prototype.select = function (tableName, options) {
        if (options === void 0) { options = '*'; }
        return this.knex.select().from(tableName);
    };
    Database.prototype.loadItem = function (a, uid) {
        var query = this.knex.select()
            .from(a)
            .where({ uid: uid })
            .first();
        return query.then(function (result) { return result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result; });
    };
    Database.prototype.loadCollection = function (a, params) {
        var query = this.knex.select()
            .from(a);
        Object.keys(params).forEach(function (param) {
            query = query.whereIn(param, params[param]);
        });
        return query.then(function (results) { return results === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : results; });
    };
    Database.prototype.createItem = function (tableName, data) {
        var _this = this;
        // throw warning if called with uid
        // validate that everything else has been sent
        var withoutUid = lodash_1.omit(data, ['uid']);
        return this.knex.transaction(function (trx) {
            return _this.knex(tableName).transacting(trx).insert(withoutUid, 'uid').returning('uid')
                .then(function (results) {
                return _this.checkIntegrity(trx)
                    .then(function (valid) {
                    if (!valid) {
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    };
    Database.prototype.updateItem = function (tableName, data) {
        var _this = this;
        // assert - must have uid
        // validation?
        return this.knex.transaction(function (trx) {
            return _this.knex(tableName).transacting(trx)
                .where({ 'uid': data.uid })
                .update(data)
                .then(function (results) {
                return _this.checkIntegrity(trx)
                    .then(function (valid) {
                    if (!valid) {
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    };
    Database.prototype.deleteItem = function (tableName, uid) {
        var _this = this;
        return this.knex.transaction(function (trx) {
            return _this.knex(tableName).transacting(trx)
                .where({ uid: uid })
                .del()
                .then(function (results) {
                return _this.checkIntegrity(trx)
                    .then(function (valid) {
                    if (!valid) {
                        throw new Exceptions_1.DatabaseIntegrityError();
                    }
                    return results;
                });
            });
        });
    };
    Database.prototype.getAncestorsOf = function (uid, tableName) {
        var _this = this;
        return this.knex.raw("\n            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM " + tableName + "),\n                ancestor(uid) AS (\n                SELECT parent FROM parent_of WHERE uid=" + uid + "\n                UNION ALL\n                SELECT parent FROM parent_of JOIN ancestor USING(uid) )\n\t\t\t\tSELECT * from ancestor")
            .then(function (result) {
            if (_this.dbType === 'pg') {
                result = result.rows;
            }
            return result.filter(function (a) { return a.uid !== null; }).map(function (a) { return a.uid; });
        });
    };
    Database.prototype.getChildrenOf = function (uid, tableName) {
        var _this = this;
        return this.knex.raw("\n            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM " + tableName + "),\n                ancestor(parent) AS (\n                SELECT uid FROM parent_of WHERE uid=" + uid + "\n                UNION ALL\n                SELECT uid FROM parent_of JOIN ancestor USING(parent) )\n\t\t\t\tSELECT * from ancestor")
            .then(function (result) {
            if (_this.dbType === 'pg') {
                result = result.rows;
            }
            return result.filter(function (a) { return a.parent !== null; }).map(function (a) { return a.parent; });
        });
    };
    Database.prototype.checkIntegrity = function (trx) {
        var toInt = this.dbType === 'pg' ? '::int' : '';
        return Promise.all([
            this.knex.transacting(trx).select(this.knex.raw("SUM((records.value_type != predicates.range_type)" + toInt + ") AS valid"))
                .from('records')
                .innerJoin('predicates', 'records.predicate', 'predicates.uid'),
            this.knex.transacting(trx).select(this.knex.raw("\n                SUM((\n\n                entities.type not in (\n                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),\n                                ancestor(parent) AS (\n                                SELECT uid FROM parent_of WHERE uid=predicates.range_ref\n                                UNION ALL\n                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )\n                                SELECT * from ancestor\n                )\n\n                )" + toInt + ") as valid\n            "))
                .from('records')
                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
                .innerJoin('entities', 'entities.uid', 'records.value_entity')
                .where('records.value_type', '=', 'entity'),
            this.knex.transacting(trx).select(this.knex.raw("\n               SUM((\n\n                entities.type not in (\n                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),\n                                ancestor(parent) AS (\n                                SELECT uid FROM parent_of WHERE uid=predicates.domain\n                                UNION ALL\n                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )\n                                SELECT * from ancestor\n                )\n\n                )" + toInt + ") as valid\n            "))
                .from('records')
                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
                .innerJoin('entities', 'entities.uid', 'records.entity')
        ]).then(function (_a) {
            var a = _a[0][0], b = _a[1][0], c = _a[2][0];
            return (parseInt(a.valid === null ? 0 : a.valid) +
                parseInt(b.valid === null ? 0 : b.valid) +
                parseInt(c.valid === null ? 0 : c.valid) === 0);
        });
    };
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=Database.js.map