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
const falcon_core_1 = require("@digihum/falcon-core");
const ApiService_1 = require("../ApiService");
const DataStore_1 = require("./DataStore");
const react_sortable_hoc_1 = require("react-sortable-hoc");
const mobx_1 = require("mobx");
const lodash_1 = require("lodash");
const moment = require("moment");
class DataController {
    constructor(api) {
        this.api = api;
        this.dataStore = lodash_1.cloneDeep(DataStore_1.emptyDataStore);
        this.tabs = [];
        if (typeof window !== 'undefined') {
            const tabString = window.localStorage.getItem('open_tabs');
            if (tabString !== null) {
                this.tabs = JSON.parse(tabString);
            }
        }
    }
    // checks that the page exists and adds it to tabs if necessery
    enterPage(workspace, uid, other) {
        if (!lodash_1.isNaN(uid)) {
            if (lodash_1.find(this.tabs, (tab) => tab.tabType === workspace && tab.uid == uid) === undefined) {
                this.tabs = this.tabs.concat([{ tabType: workspace, uid: uid, tabClass: 'item' }]);
                return false;
            }
        }
        if (other !== null) {
            this.entitySearchColumns = [other['col1p'], other['col2p'], other['col3p']].filter((a) => a !== undefined);
        }
        else {
            this.entitySearchColumns = [];
        }
        return true;
    }
    loadTabData(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tab.tabClass !== 'item') {
                return new falcon_core_1.Entity();
            }
            switch (tab.tabType) {
                case 'entity':
                    return Promise.all([
                        this.api.getItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, tab.uid),
                        this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { entity: tab.uid }),
                        this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
                    ]).then(([entity, records, referenceRecords]) => ({ entity, records, referenceRecords }));
                case 'predicate':
                    return this.api.getItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, tab.uid);
                case 'entity_type':
                    return this.api.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, tab.uid);
                case 'source':
                    return Promise.all([
                        this.api.getItem(falcon_core_1.Source, ApiService_1.AppUrls.source, tab.uid),
                        this.api.getCollection(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, { source: tab.uid })
                    ]).then(([source, source_element]) => ({ source, source_element }));
                default:
                    throw new Error('Unexpected tab type requested');
            }
        });
    }
    /*
    * Loads required data from the server
    * @return Promise returning a boolean indicating whether the operation was succesful
    */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            // LOAD TABS
            const groupedTabs = lodash_1.groupBy(this.tabs, 'tabType');
            if (lodash_1.find(this.tabs, (tab) => tab.tabType === 'source' && tab.uid === this.defaultSource) === undefined) {
                this.defaultSource = null;
            }
            const tabPromise = Promise.all(Object.keys(groupedTabs).map((tabType) => Promise.all(groupedTabs[tabType].map((tab) => this.loadTabData(tab)
                .then((value) => {
                return { [parseInt(tab.uid)]: { value, lastUpdate: moment() } };
            })
                .catch((err) => {
                this.tabs = this.tabs.filter((tab2) => tab2 !== tab);
                this.saveTabs();
                // propogate the error
                throw err;
            })))
                .then((tabData) => {
                return { [tabType]: Object.assign({}, ...tabData) };
            })));
            // load lists of data commonly required by views
            const allPromise = Promise.all([
                this.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {}),
                this.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {}),
                this.api.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, {}),
                this.api.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {}),
                this.api.getItem(falcon_core_1.ElementSet, ApiService_1.AppUrls.element_set, 1)
            ])
                .then(([predicates, sources, entities, entityType, dublinCore]) => {
                return {
                    predicate: { value: predicates, lastUpdate: moment() },
                    source: { value: sources, lastUpdate: moment() },
                    entity: { value: entities, lastUpdate: moment() },
                    entity_type: { value: entityType, lastUpdate: moment() },
                    dublinCore: { value: dublinCore, lastUpdate: moment() }
                };
            });
            return Promise.all([tabPromise, allPromise])
                .then(mobx_1.action(([tabsArray, all]) => __awaiter(this, void 0, void 0, function* () {
                const tabs = Object.assign({}, ...tabsArray);
                this.dataStore.tabs = tabs;
                this.dataStore.all = all;
                if (this.entitySearchColumns.length > 0) {
                    this.dataStore.records = yield this.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, {
                        predicate: this.entitySearchColumns,
                        entity: this.dataStore.all.entity.value.map((entity) => entity.uid)
                    });
                }
                return true;
            })));
        });
    }
    /*
    *
    *    API
    *
    */
    getItem(obj, baseUrl, uid) {
        return this.api.getItem.apply(this.api, arguments);
    }
    getCollection(obj, baseUrl, params) {
        return this.api.getCollection.apply(this.api, arguments);
    }
    postItem(obj, baseUrl, data, params) {
        return this.api.postItem.apply(this.api, arguments).then((result) => this.update().then(() => result));
    }
    putItem(obj, baseUrl, uid, data) {
        return this.api.putItem.apply(this.api, arguments).then((result) => this.update().then(() => result));
    }
    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
    //context of the 'setState' function in react
    patchItem(obj, baseUrl, uid, data) {
        return this.api.patchItem.apply(this.api, arguments).then((result) => this.update().then(() => result));
    }
    delItem(obj, baseUrl, uid) {
        return this.api.delItem.apply(this.api, arguments).then((result) => this.update().then(() => result));
    }
    query(graphQLQuery) {
        return this.api.query.apply(this.api, arguments);
    }
    getStats() {
        return this.api.getStats.apply(this.api, arguments);
    }
    /*
    *
    *    TABS
    *
    */
    createTab(tabType, uid, tabClass, data, query) {
        // don't add a tab if it already exists
        if (lodash_1.find(this.tabs, (tab) => tab.tabType === tabType && tab.uid == uid) === undefined) {
            this.tabs.unshift({ tabType, uid, data, tabClass, query });
            this.saveTabs();
            this.update();
        }
    }
    updateTab(tabType, uid, data) {
        const tabs = lodash_1.cloneDeep(this.tabs);
        const tabId = lodash_1.findIndex(tabs, (tab) => tab.tabType === tabType && tab.uid === uid);
        if (tabId !== -1) {
            tabs[tabId].data = data;
            this.tabs = tabs;
        }
    }
    closeTab(tabType, uid) {
        this.tabs = this.tabs.filter((a) => a.tabType !== tabType || a.uid !== uid);
        this.saveTabs();
        this.update();
    }
    saveTabs() {
        const tabsString = JSON.stringify(this.tabs);
        window.localStorage.setItem('open_tabs', tabsString);
    }
    clearAllTabs() {
        this.tabs = [];
        this.saveTabs();
        this.update();
    }
    reorderTabs(data) {
        this.tabs = react_sortable_hoc_1.arrayMove(this.tabs, data.oldIndex, data.newIndex);
        this.saveTabs();
    }
}
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
    __metadata("design:returntype", Promise)
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