/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { LOAD_ENTITY } from './actions';
import { Entity, Predicate, Record, Source } from '../common/datamodel/datamodel';

import { Map } from 'immutable';

interface FalconAppState {
  entity: Map<string, Entity>;
  predicate: Map<string, Predicate>;
  record: Map<string, Record>;
  source: Map<string, Source>;
}

const initialState : FalconAppState = {
  entity: Map<string, Entity>(),
  predicate: Map<string, Predicate>(),
  record: Map<string, Record>(),
  source: Map<string, Source>()
};

export const reducer = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  // For now, don't handle any actions
  // and just return the state given to us.
  return Object.assign({}, state, {
      loaded_entity: action.id
  });
}