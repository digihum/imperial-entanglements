/**
 * @fileOverview Controller for records
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
var RecordController = (function (_super) {
    __extends(RecordController, _super);
    function RecordController(db) {
        return _super.call(this, db, 'records') || this;
    }
    RecordController.toSchema = function (data) {
        var schemaOutput = lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'value', 'valueType', 'creationTimestamp', 'label', 'lastmodifiedTimestamp');
        schemaOutput.value_type = data.valueType;
        if (data.valueType !== undefined && data.valueType !== 'source') {
            schemaOutput['value_' + data.valueType] = data.value;
        }
        return Object.assign({}, schemaOutput, {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    };
    RecordController.fromSchema = function (data) {
        data.valueType = data.value_type;
        switch (data.value_type) {
            case 'entity':
                data.value = data.value_entity;
                break;
            case 'string':
                data.value = data.value_string;
                break;
            case 'date':
                data.value = data.value_date;
                break;
            case 'integer':
                data.value = data.value_integer;
                break;
            case 'point':
                data.value = data.value_point;
                break;
            case 'region':
                data.value = data.value_region;
                break;
            case 'source':
                data.value = data.source;
                break;
            default:
                data.value = null;
        }
        return Object.assign(Object.create(falcon_core_1.Record.prototype), data);
    };
    RecordController.prototype.toSchema = function (data) {
        return RecordController.toSchema(data);
    };
    RecordController.prototype.fromSchema = function (data) {
        return RecordController.fromSchema(data);
    };
    RecordController.prototype.postItem = function (obj, data, params) {
        var _this = this;
        // predicate domain must equal value_type
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(function (_a) {
            var predicate = _a[0];
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return _super.prototype.postItem.call(_this, obj, data, params);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    };
    RecordController.prototype.putItem = function (obj, uid, data) {
        //TODO: what happens if we only update the value - and do not send the valueType again?
        var _this = this;
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(function (_a) {
            var predicate = _a[0];
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return _super.prototype.putItem.call(_this, obj, uid, data);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    };
    RecordController.prototype.patchItem = function (obj, uid, data) {
        var _this = this;
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(function (_a) {
            var predicate = _a[0];
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return _super.prototype.patchItem.call(_this, obj, uid, data);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    };
    return RecordController;
}(GenericController_1.GenericController));
exports.RecordController = RecordController;
//# sourceMappingURL=RecordController.js.map