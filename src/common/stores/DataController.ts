/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { FalconItem, Entity, Record, Source, Predicate, EntityType, SourceElement, ElementSet } from 'falcon-core';
import { ApiService, AppUrls } from '../ApiService';
import { DataStore, emptyTabs, emptyDataStore } from './DataStore';
import { Tab } from '../components/Sidebar';
import { Map } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';

import { TrackedFalconItem, CompositeKey } from 'falcon-core';

import { observable, action } from 'mobx';


import { cloneDeep, find, groupBy, findIndex, isNaN } from 'lodash';

import * as moment from 'moment';

export class DataController implements ApiService {

  @observable public dataStore: DataStore;
  @observable public tabs: Tab[];
  @observable public defaultSource: null | number;

  private readonly api: ApiService;

  public constructor(api: ApiService) {

    this.api = api;

    this.dataStore = cloneDeep(emptyDataStore);

    this.tabs = [];

    if (typeof window !== 'undefined') {
      const tabString = window.localStorage.getItem('open_tabs');
      if (tabString !== null) {
        this.tabs = JSON.parse(tabString);
      }
    }
  }

  // checks that the page exists and adds it to tabs if necessery
  @action public enterPage(workspace: string, uid: number, other: any) {
    if (!isNaN(uid)) {
      if (find(this.tabs, (tab) => tab.tabType === workspace && tab.uid == uid) === undefined) {
        this.tabs = this.tabs.concat([{ tabType: workspace, uid: uid, tabClass: 'item'}]);
      }
    }
    return this.update();
  }

  private loadTabData(tab: Tab) : Promise<any> {
    if (tab.tabClass !== 'item') {
      return Promise.resolve(new Entity());
    }
    switch (tab.tabType) {
        case 'entity':
            return Promise.all([
                this.api.getItem(Entity, AppUrls.entity, tab.uid),
                this.api.getCollection(Record, AppUrls.record, { entity: tab.uid }),
                this.api.getCollection(Record, AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
            ]).then(([entity, records, referenceRecords]) => ({ entity, records, referenceRecords }));
        case 'predicate':
            return this.api.getItem(Predicate, AppUrls.predicate, tab.uid);
        case 'entity_type':
            return this.api.getItem(EntityType, AppUrls.entity_type, tab.uid);
        case 'source':
            return Promise.all([
                this.api.getItem(Source, AppUrls.source, tab.uid),
                this.api.getCollection(SourceElement, AppUrls.source_element, { source: tab.uid })
            ]).then(([source, source_element]) => ({ source, source_element }));
        default:
            throw new Error('Unexpected tab type requested');
    }
  }

  @action public async update() : Promise<boolean> {

    // LOAD TABS
    const groupedTabs = groupBy(this.tabs, 'tabType');

    if (find(this.tabs, (tab: Tab) => tab.tabType === 'source' && tab.uid === this.defaultSource) === undefined) {
      this.defaultSource = null;
    }

    const tabPromise = Promise.all(
      Object.keys(groupedTabs).map((tabType) =>
        Promise.all(groupedTabs[tabType].map((tab) =>
          this.loadTabData(tab)
          .then((value) => {
            return { [`${tab.tabType}-${tab.uid}`]: { value, lastUpdate: moment() }};
          })
        ))
        .then((tabData) => {
          return { [tabType]: Map(Object.assign({}, ...tabData)) };
        })
      )
    );

    // load lists of data commonly required by views
    const allPromise = Promise.all([
        this.api.getCollection(Predicate, AppUrls.predicate, {}),
        this.api.getCollection(Source, AppUrls.source, {}),
        this.api.getCollection(Entity, AppUrls.entity, {}),
        this.api.getCollection(EntityType, AppUrls.entity_type, {}),
        this.api.getItem(ElementSet, AppUrls.element_set, 1)
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
    .then(action(([tabsArray, all]) => {
        const tabs = Object.assign({}, ...tabsArray);
        this.dataStore.tabs = tabs;
        this.dataStore.all = all;
        return true;
    }));
  }

  /*
  *
  *    API
  *
  */

  public getItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<T> {
    return this.api.getItem.apply(this, arguments);
  }

  public getCollection<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
    return this.api.getCollection.apply(this, arguments);
  }

  public postItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, data: T) : Promise<any> {
    return this.api.postItem.apply(this, arguments).then((result) => this.update().then(() => result));
  }

  public putItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data: T) : Promise<any> {
    return this.api.putItem.apply(this, arguments).then((result) => this.update().then(() => result));
  }

  //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
  //context of the 'setState' function in react
  public patchItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data : any) : Promise<any> {
    return this.api.patchItem.apply(this, arguments).then((result) => this.update().then(() => result));
  }

  public delItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<any> {
    return this.api.delItem.apply(this, arguments).then((result) => this.update().then(() => result));
  }

  public query(graphQLQuery: string) : Promise<any> {
    return this.api.query.apply(this, arguments);
  }

  public getStats() : Promise<any> {
    return this.api.getStats.apply(this, arguments);
  }

  /*
  *
  *    TABS
  *
  */

  @action public createTab(tabType: string, uid: number, tabClass: string, data?: any, query?: { [s: string]: string }) {
    // don't add a tab if it already exists
    if (find(this.tabs, (tab) => tab.tabType === tabType && tab.uid == uid) === undefined) {
      this.tabs.unshift({ tabType, uid, data, tabClass, query });
      this.saveTabs();
      this.update();
    }
  }

  @action public updateTab(tabType: string, uid: number, data: any) {
    const tabs = cloneDeep(this.tabs);
    const tabId = findIndex(tabs, (tab) => tab.tabType === tabType && tab.uid === uid);
    if (tabId !== -1) {
      tabs[tabId].data = data;
      this.tabs = tabs;
    }
  }

  @action public closeTab(tabType: string, uid: number) {
    this.tabs = this.tabs.filter((a) => a.tabType !== tabType || a.uid !== uid);
    this.saveTabs();
    this.update();
  }

  @action public saveTabs() {
    const tabsString = JSON.stringify(this.tabs);
    window.localStorage.setItem('open_tabs', tabsString);
  }

  @action public clearAllTabs() {
    this.tabs = [];
    this.saveTabs();
    this.update();
  }

  @action public reorderTabs(data: {newIndex: number, oldIndex: number}) {
    this.tabs = arrayMove(this.tabs, data.oldIndex, data.newIndex);
    this.saveTabs();
  }
}
