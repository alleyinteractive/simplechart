/**
 * Toggle Help panel
 */

import { RECEIVE_HELP_DOCUMENT, CLEAR_HELP_DOCUMENT } from '../constants';
import actionTrigger from '../actions';

export default function receiveHelpDocument({ getState }) {
  return (dispatch) => (action) => {
    // Clear helpDocument in store when we receive the value we already have.
    // This will close the Help panel if it is open.
    if (RECEIVE_HELP_DOCUMENT === action.type &&
      getState().helpDocument === action.data
    ) {
      return dispatch(actionTrigger(CLEAR_HELP_DOCUMENT));
    }
    return dispatch(action);
  };
}
