/**
 * @fileOverview Controller for source elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var falcon_core_1 = require("@digihum/falcon-core");
var GenericController_1 = require("./GenericController");
var Exceptions_1 = require("../../common/Exceptions");
var lodash_1 = require("lodash");
var SourceElementController = (function (_super) {
    __extends(SourceElementController, _super);
    function SourceElementController(db) {
        return _super.call(this, db, 'source_elements') || this;
    }
    SourceElementController.prototype.toSchema = function (data) {
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'creationTimestamp', 'lastmodifiedTimestamp', 'uid', 'label'), {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp,
            // TODO: check these exist
            source: data.uid.values['source'],
            element: data.uid.values['element']
        });
    };
    SourceElementController.prototype.fromSchema = function (data) {
        return Object.assign(Object.create(falcon_core_1.SourceElement.prototype), Object.assign(data, {
            uid: {
                order: ['source', 'element'],
                values: {
                    source: data.source,
                    element: data.element
                }
            }
        }));
    };
    SourceElementController.prototype.getItemJson = function (obj, uid) {
        var _this = this;
        return this.db.query().select()
            .from(this.tableName)
            .where(uid.values)
            .first()
            .then(function (result) { return result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result; })
            .then(function (data) { return _this.fromSchema(data); });
    };
    SourceElementController.prototype.putItem = function (obj, uid, data) {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(this.toSchema(data));
    };
    SourceElementController.prototype.patchItem = function (obj, uid, data) {
        var schemaData = this.toSchema(data);
        var keys = Object.keys(schemaData);
        var updateObject = {};
        for (var i = 0; i < keys.length; i += 1) {
            if (schemaData[keys[i]] !== undefined) {
                updateObject[keys[i]] = schemaData[keys[i]];
            }
        }
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(updateObject)
            .then(function () { return true; })
            .catch(function (err) { throw new Error(err); });
    };
    SourceElementController.prototype.deleteItem = function (obj, uid) {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .del();
    };
    return SourceElementController;
}(GenericController_1.GenericController));
exports.SourceElementController = SourceElementController;
//# sourceMappingURL=SourceElementController.js.map