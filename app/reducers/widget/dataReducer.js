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

import {
  RECEIVE_WIDGET,
  RECEIVE_WIDGET_DATA,
  RECEIVE_WIDGET_OPTIONS,
  RECEIVE_WIDGET_METADATA,
} from '../../constants';
import update from 'immutability-helper';

export default function dataReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_WIDGET: {
      const receivedData = {};
      receivedData[action.data.widget] = action.data.data;
      return update(state, { $merge: receivedData });
    }

    case RECEIVE_WIDGET_DATA: {
      return update(state, { $apply: (updated) => {
        if (!updated[action.data.widget]) {
          updated[action.data.widget] = {}; // eslint-disable-line no-param-reassign
        }
        updated[action.data.widget].data = action.data.data; // eslint-disable-line no-param-reassign
        return updated;
      } });
    }

    case RECEIVE_WIDGET_OPTIONS:
    case RECEIVE_WIDGET_METADATA: {
      let key;
      if (action.type === RECEIVE_WIDGET_OPTIONS) {
        key = 'options';
      } else {
        key = 'metadata';
      }
      return update(state, { $apply: (updated) => {
        if (!updated[action.data.widget]) {
          updated[action.data.widget] = {}; // eslint-disable-line no-param-reassign
        }
        updated[action.data.widget][key] = update( // eslint-disable-line no-param-reassign
          updated[action.data.widget][key], { $merge: action.data.data });
        return updated;
      } });
    }

    default:
      return state;
  }
}
