export default function reducer(state, action, initState, expectAction) {
  // Return new value for expected action
  if (action.type === expectAction) {
    return action.data;
  }

  // State should be undefined *only* during initial setup of expected action
  if (typeof state === 'undefined') {
    return initState;
  }

  // Return current state of an action other than the one we're expecting
  return state;
}
