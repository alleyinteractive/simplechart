import { partial, flow as compose } from 'lodash';

import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Create a generic reducer that takes the action data payload and applies it directly to the
 * state with an immutability helper command.
 *
 * @param {string} command - An immutability helper command to apply to the state object property.
 * @param {object} actionMap - A map of action types to state object properties.
 * @param {function} [resolveValue] - A callback to resolve the value, otherwise the action data
 *  will be cloned and applied to the object state property.
 *
 * @returns {function} - A reducer function
 */
export function createGenericReducer(command, actionMap, resolveValue = null) {
  return (state, { type, data }) => {
    const property = actionMap[type];
    if (!property) {
      return state;
    }

    const value = resolveValue ?
      resolveValue(data, property) :
      cloneDeep(data);

    return update(state, {
      [property]: {
        [command]: value,
      },
    });
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
