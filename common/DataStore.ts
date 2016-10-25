/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { Map } from 'immutable';
import { Predicate, EntityType, Entity, Record, Source } from '../common/datamodel/datamodel';
import * as moment from 'moment';

export interface DataStoreEntry<T> {
    value: T[];
    lastUpdate: moment.Moment | null;
}

export interface DataStore {
  entity: Map<string, DataStoreEntry<Entity>>;
  entityType: Map<string, DataStoreEntry<EntityType>>;
  predicate: Map<string, DataStoreEntry<Predicate>>;
  record: Map<string, DataStoreEntry<Record>>;
  source: Map<string, DataStoreEntry<Source>>;
}