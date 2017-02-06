/**
 * @fileOverview Generic controller containing logic common to most controller classes
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var Exceptions_1 = require("../../common/Exceptions");
var GenericController = (function () {
    function GenericController(db, table, readTable) {
        this.db = db;
        this.tableName = table;
        this.readTableName = readTable === undefined ? table : readTable;
    }
    GenericController.prototype.getItemJson = function (obj, uid) {
        var _this = this;
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.loadItem(this.readTableName, uid)
            .then(function (data) { return _this.fromSchema(data); });
    };
    GenericController.prototype.getCollectionJson = function (obj, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return this.db.loadCollection(this.readTableName, params)
            .then(function (data) { return data.map(function (datum) { return _this.fromSchema(datum); }); });
    };
    GenericController.prototype.postItem = function (obj, data, params) {
        return this.db.createItem(this.tableName, this.toSchema(data));
    };
    GenericController.prototype.putItem = function (obj, uid, data) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.updateItem(this.tableName, this.toSchema(data));
    };
    GenericController.prototype.patchItem = function (obj, uid, data) {
        var _this = this;
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        if (data.uid !== undefined) {
            throw new Exceptions_1.InvalidUpdateException('Cannot patch uid');
        }
        return this.db.loadItem(this.tableName, uid)
            .then(function (originalData) {
            return _this.db.updateItem(_this.tableName, _this.toSchema(Object.assign(_this.fromSchema(originalData), data)));
        });
    };
    GenericController.prototype.deleteItem = function (obj, uid) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.deleteItem(this.tableName, uid);
    };
    return GenericController;
}());
exports.GenericController = GenericController;
//# sourceMappingURL=GenericController.js.map