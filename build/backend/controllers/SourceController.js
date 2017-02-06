/**
 * @fileOverview Controller for sources
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
var SourceController = (function (_super) {
    __extends(SourceController, _super);
    function SourceController(db) {
        return _super.call(this, db, 'sources') || this;
    }
    SourceController.prototype.toSchema = function (data) {
        var allowedKeys = new Set(['uid', 'label', 'parent', 'sameAs', 'readonly', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        var extraKeys = Object.keys(data).filter(function (a) { return !allowedKeys.has(a); });
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        return Object.assign({}, lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'metaData', 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    };
    SourceController.prototype.fromSchema = function (data) {
        return Object.assign(Object.create(falcon_core_1.Source.prototype), Object.assign(lodash_1.omit(data, 'same_as', 'creation_timestamp', 'lastmodified_timestamp'), {
            'sameAs': data.same_as,
            'creationTimestamp': data.creation_timestamp,
            'lastmodifiedTimestamp': data.lastmodified_timestamp
        }));
    };
    // override the getItemJson and getCollectionJson functions to also get information about the
    // metadata associated with the retrieved source
    SourceController.prototype.getMetadata = function (fields, sourceId) {
        var _this = this;
        return this.db.getAncestorsOf(sourceId, 'sources')
            .then(function (parents) {
            parents = [sourceId].concat(parents);
            return Promise.all(parents.map(function (parent) {
                return _this.db.query().select(fields)
                    .from('source_elements')
                    .innerJoin('elements', function () { this.on('source_elements.element', '=', 'elements.uid'); })
                    .innerJoin('element_sets', function () { this.on('element_sets.uid', '=', 'elements.element_set'); })
                    .where({ 'source_elements.source': parent });
            })).then(function (results) {
                var a = lodash_1.groupBy(lodash_1.flatten(results), 'label');
                return Object.keys(a).reduce(function (prev, cur) {
                    var meta = lodash_1.omit(a[cur][0], 'source', 'value');
                    meta['values'] = a[cur]
                        .map(function (val) { return ({ source: val.source, value: val.value, uid: val.uid }); })
                        .sort(function (a, b) { return parents.indexOf(a.source) - parents.indexOf(b.source); });
                    return Object.assign(prev, (_a = {}, _a[cur] = meta, _a));
                    var _a;
                }, {});
            });
        });
    };
    SourceController.prototype.getItemJson = function (obj, uid) {
        var _this = this;
        return _super.prototype.getItemJson.call(this, obj, uid)
            .then(function (source) {
            if (source.uid === null) {
                throw new Error('could not find source');
            }
            return Promise.all([
                _this.getMetadata([
                    'source_elements.source as source',
                    'elements.label',
                    'source_elements.value',
                    'elements.description',
                    'element_sets.label as element_set',
                    'elements.comment',
                    'elements.uri',
                    'elements.uid as element_uid'
                ], source.uid),
                _this.db.query().select('uid').from('sources').where({ parent: uid }),
                _this.db.getAncestorsOf(uid, 'sources')
            ])
                .then(function (_a) {
                var sourceElements = _a[0], children = _a[1], parents = _a[2];
                source.metaData = sourceElements;
                source.children = children.map(function (child) { return child.uid; }).filter(function (child) { return child !== null; });
                source.parents = parents;
                return source;
            });
        });
    };
    SourceController.prototype.getCollectionJson = function (obj, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return _super.prototype.getCollectionJson.call(this, obj, params)
            .then(function (sources) {
            return Promise.all(sources.map(function (source) {
                if (source.uid === null) {
                    throw new Error('could not find source');
                }
                return _this.getMetadata([
                    'elements.label',
                    'source_elements.value'
                ], source.uid)
                    .then(function (sourceElements) {
                    source.metaData = sourceElements;
                    return source;
                });
            }));
        });
    };
    //TODO should find every child source, not just the direct children
    SourceController.prototype.deleteItem = function (obj, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, records, sources;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.db.loadCollection('records', { source: uid }),
                            this.db.loadCollection('sources', { parent: uid })
                        ])];
                    case 1:
                        _a = _b.sent(), records = _a[0], sources = _a[1];
                        if (records.length + sources.length === 0) {
                            return [2 /*return*/, this.db.deleteItem(this.tableName, uid)];
                        }
                        else {
                            throw new Exceptions_1.OperationNotPermittedException({
                                message: 'The operation could not be completed as the source is used by other records',
                                data: Promise.resolve({
                                    record: records.map(function (record) { return RecordController_1.RecordController.fromSchema(record); }),
                                    source: sources.map(function (source) { return _this.fromSchema(source); })
                                })
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SourceController;
}(GenericController_1.GenericController));
exports.SourceController = SourceController;
//# sourceMappingURL=SourceController.js.map