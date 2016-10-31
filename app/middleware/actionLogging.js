/* eslint-disable no-console */
import enableActionLogging from '../constants/enableActionLogging';
import {
  CLEAR_ERROR,
  RECEIVE_ERROR,
  UPDATE_CURRENT_STEP,
  UNSAVED_CHANGES,
} from '../constants';
/**
 * Log actions received. This should be the last middleware in the chain
 * in order to catch dispatches triggered by other middleware.
 * Our user-facing error messages are pretty easy to track down so we don't
 * need to log them.
 */
export default function middleware() {
  return (dispatch) => (action) => {
    const skipLogging = [
      CLEAR_ERROR,
      RECEIVE_ERROR,
      UPDATE_CURRENT_STEP,
      UNSAVED_CHANGES,
    ];
    if (enableActionLogging && -1 === skipLogging.indexOf(action.type)) {
      console.log(`Received ${action.type} from ${action.src || 'unknown'}`);
      console.log(action.data);
      console.log('--------------');
    }
    return dispatch(action);
  };
}
