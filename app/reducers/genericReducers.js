import { partial, flow as compose } from 'lodash';

import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Reusable reducers for any parts of the store that don't need to do anything fancy
 * See http://redux.js.org/docs/basics/Reducers.html for explanation of basic reducers
 * This uses `initState` to and `allowActions` to dynamically set the reducer's initial state
 * and specify which actions it should be applied to
 */
export function baseReducer(initState, allowActions) {
  // Initial state applies only when Redux is initializing the store
  return (state = initState, { type, data }) => {
    // If current action type is allowed, return current action data
    if (0 <= allowActions.indexOf(type)) {
      return cloneDeep(data);
    }

    // Ignore this action
    return state;
  };
}

export function mergeReducer(initState, allowActions) {
  return (state, action) => {
    // If current action type is allowed, return merged action data
    if (0 <= allowActions.indexOf(action.type)) {
      return update(state, { $merge: action.data });
    }

    // Applies only when Redux is initializing the store
    if (undefined === state) {
      return initState;
    }

    // Ignore this action
    return state;
  };
}

/**
 * Create a middleware like reducer function that will pass the resulting state of
 * each reducer to the next, as well as the original action.
 *
 * @param {Array} reducers
 * @returns {function} A reducer function composed of reducer functions.
 */
export function createComposedReducer(reducers) {
  return (state, action) => {
    const applyAction = (reducer) =>
      partial(reducer, partial.placeholder, action);
    const reduce = compose(reducers.map(applyAction));
    return reduce(state);
  };
}
