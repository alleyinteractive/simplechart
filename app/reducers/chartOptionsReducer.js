import { RECEIVE_CHART_OPTIONS, DELETE_CHART_OPTIONS } from '../constants';
import update from 'react-addons-update';

export default function chartOptionsReducer(state = {}, action) {
  // Loop through array of keys passed via DELETE_CHART_OPTIONS
  // and delete from state if defined
  function _deleteKeys(applyState) {
    if (!action.data || !action.data.length) {
      return applyState;
    }
    action.data.forEach((key) => {
      if (typeof applyState[key] !== 'undefined') {
        delete applyState[key]; // eslint-disable-line no-param-reassign
      }
    });
    return applyState;
  }

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return update(state, { $merge: action.data });
    }

    case DELETE_CHART_OPTIONS: {
      return update(state, { $apply: _deleteKeys });
    }

    default:
      return state;
  }
}
