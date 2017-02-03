/**
 * @fileOverview Controller for records
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
const Exceptions_1 = require("../../common/Exceptions");
const lodash_1 = require("lodash");
class RecordController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'records');
    }
    static toSchema(data) {
        const schemaOutput = lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'value', 'valueType', 'creationTimestamp', 'label', 'lastmodifiedTimestamp');
        schemaOutput.value_type = data.valueType;
        if (data.valueType !== undefined && data.valueType !== 'source') {
            schemaOutput['value_' + data.valueType] = data.value;
        }
        return Object.assign({}, schemaOutput, {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    }
    static fromSchema(data) {
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
    }
    toSchema(data) {
        return RecordController.toSchema(data);
    }
    fromSchema(data) {
        return RecordController.fromSchema(data);
    }
    postItem(obj, data, params) {
        // predicate domain must equal value_type
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.postItem(obj, data, params);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }
    putItem(obj, uid, data) {
        //TODO: what happens if we only update the value - and do not send the valueType again?
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.putItem(obj, uid, data);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }
    patchItem(obj, uid, data) {
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
            .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.patchItem(obj, uid, data);
            }
            throw new Exceptions_1.OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }
}
exports.RecordController = RecordController;
//# sourceMappingURL=RecordController.js.map