/**
 * @fileOverview Generic controller containing logic common to most controller classes
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const Exceptions_1 = require("../../common/Exceptions");
class GenericController {
    constructor(db, table, readTable) {
        this.db = db;
        this.tableName = table;
        this.readTableName = readTable === undefined ? table : readTable;
    }
    getItemJson(obj, uid) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.loadItem(this.readTableName, uid)
            .then((data) => this.fromSchema(data));
    }
    getCollectionJson(obj, params = {}) {
        return this.db.loadCollection(this.readTableName, params)
            .then((data) => data.map((datum) => this.fromSchema(datum)));
    }
    postItem(obj, data, params) {
        return this.db.createItem(this.tableName, this.toSchema(data));
    }
    putItem(obj, uid, data) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.updateItem(this.tableName, this.toSchema(data));
    }
    patchItem(obj, uid, data) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        if (data.uid !== undefined) {
            throw new Exceptions_1.InvalidUpdateException('Cannot patch uid');
        }
        return this.db.loadItem(this.tableName, uid)
            .then((originalData) => {
            return this.db.updateItem(this.tableName, this.toSchema(Object.assign(this.fromSchema(originalData), data)));
        });
    }
    deleteItem(obj, uid) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.deleteItem(this.tableName, uid);
    }
}
exports.GenericController = GenericController;
//# sourceMappingURL=GenericController.js.map