/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var ApiService_1 = require("../ApiService");
var DataStore_1 = require("./DataStore");
var react_sortable_hoc_1 = require("react-sortable-hoc");
var mobx_1 = require("mobx");
var lodash_1 = require("lodash");
var moment = require("moment");
var DataController = (function () {
    function DataController(api) {
        this.api = api;
        this.dataStore = lodash_1.cloneDeep(DataStore_1.emptyDataStore);
        this.tabs = [];
        if (typeof window !== 'undefined') {
            var tabString = window.localStorage.getItem('open_tabs');
            if (tabString !== null) {
                this.tabs = JSON.parse(tabString);
            }
        }
    }
    // checks that the page exists and adds it to tabs if necessery
    DataController.prototype.enterPage = function (workspace, uid, other) {
        if (!lodash_1.isNaN(uid)) {
            if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === workspace && tab.uid == uid; }) === undefined) {
                this.tabs = this.tabs.concat([{ tabType: workspace, uid: uid, tabClass: 'item' }]);
                return false;
            }
        }
        if (other !== null) {
            this.entitySearchColumns = [other['col1p'], other['col2p'], other['col3p']].filter(function (a) { return a !== undefined; });
        }
        else {
            this.entitySearchColumns = [];
        }
        return true;
    };
    DataController.prototype.loadTabData = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (tab.tabClass !== 'item') {
                    return [2 /*return*/, new falcon_core_1.Entity()];
                }
                switch (tab.tabType) {
                    case 'entity':
                        return [2 /*return*/, Promise.all([
                                this.api.getItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, tab.uid),
                                this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { entity: tab.uid }),
                                this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
                            ]).then(function (_a) {
                                var entity = _a[0], records = _a[1], referenceRecords = _a[2];
                                return ({ entity: entity, records: records, referenceRecords: referenceRecords });
                            })];
                    case 'predicate':
                        return [2 /*return*/, this.api.getItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, tab.uid)];
                    case 'entity_type':
                        return [2 /*return*/, this.api.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, tab.uid)];
                    case 'source':
                        return [2 /*return*/, Promise.all([
                                this.api.getItem(falcon_core_1.Source, ApiService_1.AppUrls.source, tab.uid),
                                this.api.getCollection(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, { source: tab.uid })
                            ]).then(function (_a) {
                                var source = _a[0], source_element = _a[1];
                                return ({ source: source, source_element: source_element });
                            })];
                    default:
                        throw new Error('Unexpected tab type requested');
                }
                return [2 /*return*/];
            });
        });
    };
    /*
    * Loads required data from the server
    * @return Promise returning a boolean indicating whether the operation was succesful
    */
    DataController.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var groupedTabs, tabPromise, allPromise;
            return __generator(this, function (_a) {
                groupedTabs = lodash_1.groupBy(this.tabs, 'tabType');
                if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === 'source' && tab.uid === _this.defaultSource; }) === undefined) {
                    this.defaultSource = null;
                }
                tabPromise = Promise.all(Object.keys(groupedTabs).map(function (tabType) {
                    return Promise.all(groupedTabs[tabType].map(function (tab) {
                        return _this.loadTabData(tab)
                            .then(function (value) {
                            return _a = {}, _a[parseInt(tab.uid)] = { value: value, lastUpdate: moment() }, _a;
                            var _a;
                        })
                            .catch(function (err) {
                            _this.tabs = _this.tabs.filter(function (tab2) { return tab2 !== tab; });
                            _this.saveTabs();
                            // propogate the error
                            throw err;
                        });
                    }))
                        .then(function (tabData) {
                        return _a = {}, _a[tabType] = Object.assign.apply(Object, [{}].concat(tabData)), _a;
                        var _a;
                    });
                }));
                allPromise = Promise.all([
                    this.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {}),
                    this.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {}),
                    this.api.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, {}),
                    this.api.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {}),
                    this.api.getItem(falcon_core_1.ElementSet, ApiService_1.AppUrls.element_set, 1)
                ])
                    .then(function (_a) {
                    var predicates = _a[0], sources = _a[1], entities = _a[2], entityType = _a[3], dublinCore = _a[4];
                    return {
                        predicate: { value: predicates, lastUpdate: moment() },
                        source: { value: sources, lastUpdate: moment() },
                        entity: { value: entities, lastUpdate: moment() },
                        entity_type: { value: entityType, lastUpdate: moment() },
                        dublinCore: { value: dublinCore, lastUpdate: moment() }
                    };
                });
                return [2 /*return*/, Promise.all([tabPromise, allPromise])
                        .then(mobx_1.action(function (_a) {
                        var tabsArray = _a[0], all = _a[1];
                        return __awaiter(_this, void 0, void 0, function () {
                            var tabs, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        tabs = Object.assign.apply(Object, [{}].concat(tabsArray));
                                        this.dataStore.tabs = tabs;
                                        this.dataStore.all = all;
                                        if (!(this.entitySearchColumns.length > 0)) return [3 /*break*/, 2];
                                        _a = this.dataStore;
                                        return [4 /*yield*/, this.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, {
                                                predicate: this.entitySearchColumns,
                                                entity: this.dataStore.all.entity.value.map(function (entity) { return entity.uid; })
                                            })];
                                    case 1:
                                        _a.records = _b.sent();
                                        _b.label = 2;
                                    case 2: return [2 /*return*/, true];
                                }
                            });
                        });
                    }))];
            });
        });
    };
    /*
    *
    *    API
    *
    */
    DataController.prototype.getItem = function (obj, baseUrl, uid) {
        return this.api.getItem.apply(this.api, arguments);
    };
    DataController.prototype.getCollection = function (obj, baseUrl, params) {
        return this.api.getCollection.apply(this.api, arguments);
    };
    DataController.prototype.postItem = function (obj, baseUrl, data, params) {
        var _this = this;
        return this.api.postItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.putItem = function (obj, baseUrl, uid, data) {
        var _this = this;
        return this.api.putItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
    //context of the 'setState' function in react
    DataController.prototype.patchItem = function (obj, baseUrl, uid, data) {
        var _this = this;
        return this.api.patchItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.delItem = function (obj, baseUrl, uid) {
        var _this = this;
        return this.api.delItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.query = function (graphQLQuery) {
        return this.api.query.apply(this.api, arguments);
    };
    DataController.prototype.getStats = function () {
        return this.api.getStats.apply(this.api, arguments);
    };
    /*
    *
    *    TABS
    *
    */
    DataController.prototype.createTab = function (tabType, uid, tabClass, data, query) {
        // don't add a tab if it already exists
        if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === tabType && tab.uid == uid; }) === undefined) {
            this.tabs.unshift({ tabType: tabType, uid: uid, data: data, tabClass: tabClass, query: query });
            this.saveTabs();
            this.update();
        }
    };
    DataController.prototype.updateTab = function (tabType, uid, data) {
        var tabs = lodash_1.cloneDeep(this.tabs);
        var tabId = lodash_1.findIndex(tabs, function (tab) { return tab.tabType === tabType && tab.uid === uid; });
        if (tabId !== -1) {
            tabs[tabId].data = data;
            this.tabs = tabs;
        }
    };
    DataController.prototype.closeTab = function (tabType, uid) {
        this.tabs = this.tabs.filter(function (a) { return a.tabType !== tabType || a.uid !== uid; });
        this.saveTabs();
        this.update();
    };
    DataController.prototype.saveTabs = function () {
        var tabsString = JSON.stringify(this.tabs);
        window.localStorage.setItem('open_tabs', tabsString);
    };
    DataController.prototype.clearAllTabs = function () {
        this.tabs = [];
        this.saveTabs();
        this.update();
    };
    DataController.prototype.reorderTabs = function (data) {
        this.tabs = react_sortable_hoc_1.arrayMove(this.tabs, data.oldIndex, data.newIndex);
        this.saveTabs();
    };
    return DataController;
}());
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], DataController.prototype, "dataStore", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], DataController.prototype, "tabs", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Number)
], DataController.prototype, "defaultSource", void 0);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Boolean)
], DataController.prototype, "enterPage", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DataController.prototype, "update", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "createTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "updateTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "closeTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataController.prototype, "saveTabs", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataController.prototype, "clearAllTabs", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "reorderTabs", null);
exports.DataController = DataController;
//# sourceMappingURL=DataController.js.map