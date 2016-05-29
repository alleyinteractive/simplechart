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

import { RECEIVE_DATA } from '../constants';

export default function dataReducer(state = [], action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.data;
    default:
      return state;
  }
}
