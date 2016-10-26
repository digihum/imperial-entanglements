/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { Map } from 'immutable';
import { Predicate, EntityType, Entity, Record, Source, SourceElement } from '../common/datamodel/datamodel';
import * as moment from 'moment';

export interface DataStoreEntry<T> {
    value: T;
    lastUpdate: moment.Moment | null;
}

export interface DataStore {
  all: {
    entity: DataStoreEntry<Entity[]>;
    entity_type: DataStoreEntry<EntityType[]>;
    predicate: DataStoreEntry<Predicate[]>;
    source: DataStoreEntry<Source[]>;
  };

  tabs: {

    entity: Map<string, DataStoreEntry<{
      entity: Entity;
      records: Record[];
    }>>;

    entity_type: Map<string, DataStoreEntry<EntityType>>;

    predicate: Map<string, DataStoreEntry<Predicate>>;

    source: Map<string, DataStoreEntry<{
      source: Source;
      elements: SourceElement;
    }>>;

  };
}

export const emptyDataStore : DataStore = {

  all: {
    entity: { value: [], lastUpdate: null },
    entity_type: { value: [], lastUpdate: null },
    predicate: { value: [], lastUpdate: null },
    source: { value: [], lastUpdate: null }
  },

  tabs: {
    entity: Map<string, DataStoreEntry<{
      entity: Entity;
      records: Record[];
    }>>(),

    entity_type: Map<string, DataStoreEntry<EntityType>>(),
    predicate: Map<string, DataStoreEntry<Predicate>>(),

    source: Map<string, DataStoreEntry<{
      source: Source;
      elements: SourceElement;
    }>>()
  }
};