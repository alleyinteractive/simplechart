import merge from 'lodash/fp/merge';

import { RECEIVE_CHART_OPTIONS } from '../constants';

export default function chartOptionsReducer(state = {}, action) {
  const newState = Object.assign({ chartOptions: {} }, state);

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return merge(newState, { chartOptions: action.data });
    }

    default:
      return newState;
  }
}
