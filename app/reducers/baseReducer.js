import { BASE_REDUCER_ACTIONS } from '../constants';

export default function reducer(state, action, initState) {
  // Return new value for current action;
  if (BASE_REDUCER_ACTIONS.indexOf(action.type) > -1) {
    return action.data;
  }

  // Return state if provided
  if (typeof state !== 'undefined') {
    return state;
  }

  return initState;
}
