/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { FalconItem, Entity, Record, Source, Predicate, EntityType, SourceElement, ElementSet } from 'falcon-core';
import { ApiService, AppUrls } from './ApiService';
import { DataStore, emptyTabs } from './DataStore';
import { Tab } from './components/Sidebar';
import { Map } from 'immutable';

import { cloneDeep, find, groupBy } from 'lodash';

import * as moment from 'moment';

const loadTabData = (api: ApiService, tab: Tab) : Promise<FalconItem> => {
    switch (tab.tabType) {
        case 'entity':
            return Promise.all([
                api.getItem(Entity, AppUrls.entity, tab.uid),
                api.getCollection(Record, AppUrls.record, { entity: tab.uid }),
                api.getCollection(Record, AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
            ]).then(([entity, records, referenceRecords]) => ({ entity, records, referenceRecords }));
        case 'predicate':
            return api.getItem(Predicate, AppUrls.predicate, tab.uid);
        case 'entity_type':
            return api.getItem(EntityType, AppUrls.entity_type, tab.uid);
        case 'source':
            return Promise.all([
                api.getItem(Source, AppUrls.source, tab.uid),
                api.getCollection(SourceElement, AppUrls.source_element, { source: tab.uid })
            ]).then(([source, source_element]) => ({ source, source_element }));
        default:
            throw new Error('Unexpected tab type requested');
    }
}

export const reload = (api: ApiService, tabs: Tab[],
  force: boolean = false, failureCallback: (workspace: string, uid: number) => void) : Promise<DataStore> => {

  const groupedTabs = groupBy(tabs, 'tabType');

  const tabPromise = Promise.all(
    Object.keys(groupedTabs).map((tabType) =>
      Promise.all(groupedTabs[tabType].map((tab) =>
        loadTabData(api, tab)
        .then((value) => {
          return { [`${tab.tabType}-${tab.uid}`]: { value, lastUpdate: moment() }};
        })
        .catch((err) => {
          failureCallback(tab.tabType, tab.uid);
        })
      ))
      .then((tabData) => {
        return { [tabType]: Map(Object.assign({}, ...tabData)) };
      })
    )
  );

  // load lists of data commonly required by views
  const allPromise = Promise.all([
      api.getCollection(Predicate, AppUrls.predicate, {}),
      api.getCollection(Source, AppUrls.source, {}),
      api.getCollection(Entity, AppUrls.entity, {}),
      api.getCollection(EntityType, AppUrls.entity_type, {}),
      api.getItem(ElementSet, AppUrls.element_set, 1)
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
  .then(([tabsArray, all]) => {
      const tabs = Object.assign({}, ...tabsArray);
      console.log("TABS", tabs);
      return { tabs, all };
  });
};

export const DataController = {
  reload
};
