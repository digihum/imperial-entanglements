/**
 * @fileOverview Controller for entity types
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
var PredicateController_1 = require("./PredicateController");
var EntityController_1 = require("./EntityController");
var Exceptions_1 = require("../../common/Exceptions");
var lodash_1 = require("lodash");
var EntityTypeController = (function (_super) {
    __extends(EntityTypeController, _super);
    function EntityTypeController(db) {
        return _super.call(this, db, 'entity_types') || this;
    }
    EntityTypeController.prototype.toSchema = function (data) {
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    };
    EntityTypeController.prototype.fromSchema = function (data) {
        return Object.assign(Object.create(falcon_core_1.EntityType.prototype), Object.assign(data, {
            'sameAs': data.same_as
        }));
    };
    EntityTypeController.prototype.getItemJson = function (obj, uid) {
        var _this = this;
        return _super.prototype.getItemJson.call(this, obj, uid)
            .then(function (result) {
            return Promise.all([
                _this.db.getAncestorsOf(uid, 'entity_types'),
                _this.db.select('entity_types', ['uid']).where({ parent: uid })
            ])
                .then(function (_a) {
                var parents = _a[0], children = _a[1];
                result.parents = parents;
                result.children = children.map(function (child) { return child.uid; });
                return result;
            });
        });
    };
    EntityTypeController.prototype.deleteItem = function (obj, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, entityTypes, entities, predicates;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.db.select(this.tableName).where('parent', '=', uid),
                            this.db.select('entities').where('type', '=', uid),
                            this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
                        ])];
                    case 1:
                        _a = _b.sent(), entityTypes = _a[0], entities = _a[1], predicates = _a[2];
                        if (entities.length + entityTypes.length + predicates.length === 0) {
                            return [2 /*return*/, this.db.deleteItem(this.tableName, uid)];
                        }
                        else {
                            throw new Exceptions_1.OperationNotPermittedException({
                                message: 'The operation could not be completed as the entity is referenced in other sources',
                                data: Promise.resolve({
                                    entityType: entityTypes.map(function (entityType) { return EntityController_1.EntityController.fromSchema(entityType); }),
                                    entity: entities.map(function (entity) { return EntityController_1.EntityController.fromSchema(entity); }),
                                    predicate: predicates.map(function (predicate) { return PredicateController_1.PredicateController.fromSchema(predicate); })
                                })
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return EntityTypeController;
}(GenericController_1.GenericController));
exports.EntityTypeController = EntityTypeController;
//# sourceMappingURL=EntityTypeController.js.map