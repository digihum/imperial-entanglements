/**
 * @fileOverview Controller for predicates
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var falcon_core_1 = require("@digihum/falcon-core");
var GenericController_1 = require("./GenericController");
var Exceptions_1 = require("../../common/Exceptions");
var RecordController_1 = require("./RecordController");
var lodash_1 = require("lodash");
var PredicateController = (function (_super) {
    __extends(PredicateController, _super);
    function PredicateController(db) {
        return _super.call(this, db, 'predicates', 'predicate_complete') || this;
    }
    PredicateController.toSchema = function (data) {
        var allowedKeys = new Set(['uid', 'uses', 'label', 'domain', 'range',
            'description', 'rangeIsReference', 'sameAs', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        var extraKeys = Object.keys(data).filter(function (a) { return !allowedKeys.has(a); });
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        var out = Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'range', 'rangeIsReference', 'sameAs', 'creationTimestamp', 'lastmodifiedTimestamp', 'uses'), {
            same_as: data.sameAs,
            range_type: data.rangeIsReference ? 'entity' : data.range,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
        if (data.rangeIsReference) {
            out['range_ref'] = data.range;
        }
        else {
            out['range_ref'] = null;
        }
        return out;
    };
    PredicateController.fromSchema = function (data) {
        if (data.range_type === 'entity') {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        }
        else {
            data.range = data.range_type;
            data.rangeIsReference = false;
        }
        if (data.uses === null) {
            data.uses = 0;
        }
        return Object.assign(Object.create(falcon_core_1.Predicate.prototype), {
            'uid': data.uid,
            'sameAs': data.same_as,
            'label': data.label,
            'lastmodifiedTimestamp': data.lastmodified_timestamp,
            'creationTimestamp': data.creation_timestamp,
            'rangeIsReference': data.rangeIsReference,
            'range': data.range,
            'domain': data.domain,
            'uses': data.uses,
            'description': data.description
        });
    };
    PredicateController.prototype.toSchema = function (data) {
        return PredicateController.toSchema(data);
    };
    PredicateController.prototype.fromSchema = function (data) {
        return PredicateController.fromSchema(data);
    };
    PredicateController.prototype.getCollectionJson = function (obj, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ancestorIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(params.domain !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.getAncestorsOf(lodash_1.isArray(params.domain) ? params.domain[0] : params.domain, 'entity_types')];
                    case 1:
                        ancestorIds = _a.sent();
                        return [2 /*return*/, this.db.select(this.readTableName).whereIn('domain', ancestorIds.concat([params.domain[0]]))
                                .then(function (results) { return results.map(function (result) { return _this.fromSchema(result); }); })];
                    case 2: return [2 /*return*/, _super.prototype.getCollectionJson.call(this, obj, params)];
                }
            });
        });
    };
    PredicateController.prototype.putItem = function (obj, uid, data) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.updateItem(this.tableName, falcon_core_1.Serializer.toJson(data));
    };
    // public patchItem(obj: { new(): Predicate; }, uid: number, data: Predicate) : Promise<boolean> {
    //     if (data.domain !== undefined) {
    //         return this.db.select('records', ['entities.type as entityType'])
    //             .distinct()
    //             .where({ predicate: uid })
    //             .innerJoin('entities', 'records.entity', 'entities.uid')
    //         .then((records) => {
    //             if (records.length > 0) {
    //                 return this.db.getChildrenOf(data.domain, 'entity_types')
    //                 .then((res) => {
    //                     records.map((e) => e.entityType)
    //                     .forEach((e) => {
    //                         if (res.indexOf(e) === -1) {
    //                             throw new OperationNotPermittedException({
    //                                 message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                                 data: Promise.resolve({})
    //                             });
    //                         }
    //                     });
    //                 }).then(() => super.patchItem(obj, uid, data));
    //             }
    //             return super.patchItem(obj, uid, data);
    //         });
    //     }
    //     //TODO: fix range enforcement
    //     if (data.range !== undefined) {
    //         return this.db.select('records')
    //             .where({ predicate: uid })
    //         .then((records) => {
    //             if (records.length > 0) {
    //                 if (data.rangeIsReference === false) {
    //                     throw new OperationNotPermittedException({
    //                         message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                         data: Promise.resolve({})
    //                     });
    //                 }
    //                 return this.db.getChildrenOf(parseInt(data.range as string), 'entity_types')
    //                 .then((res) => {
    //                     records.map((e) => e.value_entity)
    //                     .forEach((e) => {
    //                         if (res.indexOf(e) === -1) {
    //                             throw new OperationNotPermittedException({
    //                                 message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                                 data: Promise.resolve({})
    //                             });
    //                         }
    //                     });
    //                 }).then(() => super.patchItem(obj, uid, data));
    //             }
    //             return super.patchItem(obj, uid, data);
    //         });
    //     }
    //     return super.patchItem(obj, uid, data);
    // }
    PredicateController.prototype.deleteItem = function (obj, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.loadCollection('records', { predicate: uid })];
                    case 1:
                        records = _a.sent();
                        if (records.length === 0) {
                            return [2 /*return*/, this.db.deleteItem(this.tableName, uid)];
                        }
                        else {
                            throw new Exceptions_1.OperationNotPermittedException({
                                message: 'The operation could not be completed as the predicate is used by other records',
                                data: Promise.resolve({
                                    record: records.map(function (record) { return RecordController_1.RecordController.fromSchema(record); })
                                })
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return PredicateController;
}(GenericController_1.GenericController));
exports.PredicateController = PredicateController;
//# sourceMappingURL=PredicateController.js.map