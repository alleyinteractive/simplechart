/**
 * This reducer handles changes to the "data" store in our app.
 * Depending on the action, we can change the application state.
 * To add a new action, add it to the switch statement in the dataReducer function
 *
 * @example
 * case NEW_ACTION_CONSTANT:
 *   return assign({}, state, {
 *     stateVariable: action.var,
 *   });
 *
 * To add a new reducer, add a file like this one to the reducers folder and
 * add it in rootReducer.js.
 */

import { RECEIVE_API_DATA, RECEIVE_WIDGET_OPTIONS } from '../../constants';
import update from 'react-addons-update';

export default function dataReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_API_DATA: {
      const receivedData = {};
      receivedData[action.data.widget] = action.data.data;
      return update(state, { $merge: receivedData });
    }

    case RECEIVE_WIDGET_OPTIONS: {
      return update(state, { $apply: (updated) => {
        updated[action.data.widget].options = action.data.options; // eslint-disable-line no-param-reassign
        return updated;
      } });
    }

    default:
      return state;
  }
}
