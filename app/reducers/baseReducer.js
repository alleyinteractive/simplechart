/**
 * Reusable reducer for any parts of the store that don't need to do anything fancy
 * See http://redux.js.org/docs/basics/Reducers.html for explanation of basic reducers
 * This uses `initState` to and `allowActions` to dynamically set the reducer's initial state
 * and specify which actions it should be applied to
 */
export default function reducer(state, action, initState, allowActions) {
  // Return new value for allowed action
  if (allowActions.indexOf(action.type) >= 0) {
    return action.data;
  }

  // State should be undefined *only* during initial setup of expected action
  if (typeof state === 'undefined') {
    return initState;
  }

  // Return current state of an action other than the one we're expecting
  return state;
}
