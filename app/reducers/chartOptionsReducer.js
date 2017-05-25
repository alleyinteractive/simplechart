import merge from 'lodash/fp/merge';

import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../constants';
import update from 'immutability-helper';

export default function chartOptionsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return update(state, { $merge: action.data });
    }

    case RECEIVE_CHART_OPTIONS_EXTEND:
      return merge(state, action.data);

    default:
      return state;
  }
}
