/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { Predicate, EntityType, Entity, Record, Source, SourceElement, ElementSet } from '@digihum/falcon-core';
import * as moment from 'moment';

export interface DataStoreEntry<T> {
    value: T;
    lastUpdate: moment.Moment | null;
}

interface TabMap<T> {
  [uid: number]: DataStoreEntry<T>;
}

export interface DataStore {
  all: {
    entity: DataStoreEntry<Entity[]>;
    entity_type: DataStoreEntry<EntityType[]>;
    predicate: DataStoreEntry<Predicate[]>;
    source: DataStoreEntry<Source[]>;
    dublinCore: DataStoreEntry<ElementSet>;
  };

  records: Record[];

  tabs: {

    entity: TabMap<{
      entity: Entity;
      records: Record[];
      referenceRecords: Record[];
    }>;

    entity_type: TabMap<EntityType>;

    predicate: TabMap<Predicate>;

    source: TabMap<{
      source: Source;
      elements: SourceElement;
    }>;

  };

  lockedSource: number | null;
}

export const emptyDataStore : DataStore = {

  all: {
    entity: { value: [], lastUpdate: null },
    entity_type: { value: [], lastUpdate: null },
    predicate: { value: [], lastUpdate: null },
    source: { value: [], lastUpdate: null },
    dublinCore: { value: new ElementSet(), lastUpdate: null }
  },

  records: [],

  tabs: {
    entity: {},
    entity_type: {},
    predicate: {},
    source: {}
  },

  lockedSource: null
};
