/**
 * @fileOverview Controller for entities
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var lodash_1 = require("lodash");
var EntityController = (function (_super) {
    __extends(EntityController, _super);
    function EntityController(db) {
        return _super.call(this, db, 'entities') || this;
    }
    EntityController.fromSchema = function (data) {
        return Object.assign(Object.create(falcon_core_1.Entity.prototype), {
            entityType: data.type,
            uid: data.uid,
            label: data.label,
            parent: data.parent
        });
    };
    EntityController.toSchema = function (data) {
        var allowedKeys = new Set(['uid', 'label', 'entityType', 'parent', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        var extraKeys = Object.keys(data).filter(function (a) { return !allowedKeys.has(a); });
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'entityType', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            type: data.entityType,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    };
    EntityController.prototype.fromSchema = function (data) {
        return EntityController.fromSchema(data);
    };
    EntityController.prototype.toSchema = function (data) {
        return EntityController.toSchema(data);
    };
    EntityController.prototype.getCollectionJson = function (obj, params) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ancestorTypes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(params.type !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.getChildrenOf(lodash_1.isArray(params.type) ? params.type[0] : params.type, 'entity_types')];
                    case 1:
                        ancestorTypes = _a.sent();
                        return [2 /*return*/, this.db.select('entities')
                                .whereIn('type', ancestorTypes)
                                .then(function (rawEntities) { return rawEntities.map(function (entity) { return _this.fromSchema(entity); }); })];
                    case 2: return [2 /*return*/, _super.prototype.getCollectionJson.call(this, obj, params)];
                }
            });
        });
    };
    EntityController.prototype.postItem = function (obj, data, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, recordsToClone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.createItem(this.tableName, this.toSchema(data))];
                    case 1:
                        result = _a.sent();
                        if (!(params.clone !== undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.db.query()('records').where({ entity: params.clone })
                                .then(function (records) { return records.map(function (record) { return (__assign({}, record, { entity: result[0], uid: undefined })); }); })];
                    case 2:
                        recordsToClone = _a.sent();
                        return [4 /*yield*/, this.db.query()('records').insert(recordsToClone).then(function () { })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    EntityController.prototype.deleteItem = function (obj, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, entities, records;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.db.select(this.tableName).where('parent', '=', uid),
                            this.db.select('records').where('value_entity', '=', uid)
                        ])];
                    case 1:
                        _a = _b.sent(), entities = _a[0], records = _a[1];
                        if (entities.length + records.length === 0) {
                            return [2 /*return*/, this.db.deleteItem(this.tableName, uid)];
                        }
                        else {
                            throw new Exceptions_1.OperationNotPermittedException({
                                message: 'The operation could not be completed as the entity is referenced in other sources',
                                data: Promise.resolve({
                                    entity: entities,
                                    record: records
                                })
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return EntityController;
}(GenericController_1.GenericController));
exports.EntityController = EntityController;
//# sourceMappingURL=EntityController.js.map