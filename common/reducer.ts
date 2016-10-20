/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { LOAD_ENTITY } from './actions';

const initialState = {
  loaded_entity: -1
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