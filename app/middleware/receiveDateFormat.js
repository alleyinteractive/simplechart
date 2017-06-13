import update from 'immutability-helper';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_DATE_FORMAT,
  TRANSFORM_DATA,
} from '../constants';
import actionTrigger from '../actions';
import { transformParsedData } from '../utils/rawDataHelpers';

/**
 * Re-apply data transformers if we've enabled a valid date formatting string
 */
export default function receiveDateFormatMiddleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== RECEIVE_DATE_FORMAT) {
      return dispatch(action);
    }

    // Get complete dateFormat by merging new keys into state
    const stateFormat = getState().dateFormat;
    const nextDateFormat = update(stateFormat, {
      $merge: action.data,
    });

    /**
     * Determine if date formatting has changed and needs to be updated.
     * For example, if change is from one invalid string to another invalid string, no update needed
     */
    function shouldUpdateDateFormatting() {
      const stateHasFormat =
        stateFormat.enabled && stateFormat.validated;
      const nextHasFormat = nextDateFormat.enabled && nextDateFormat.validated;

      if (nextHasFormat) {
        if (stateHasFormat) {
          // True if valid -> valid with changes in format string
          // False if valid -> valid with no changes
          return nextDateFormat.formatString !== stateFormat.formatString;
        }

        // True if invalid -> valid
        return true;
      }

      // True if valid -> invalid
      // False if invalid -> invalid
      return stateHasFormat;
    }

    if (shouldUpdateDateFormatting()) {
      // Apply to transformedData
      const transformedData = transformParsedData(
        getState().parsedData,
        getState().dataFields,
        nextDateFormat
      );
      dispatch(actionTrigger(TRANSFORM_DATA, transformedData));

      // To chartOptions
      dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, {
        xAxis: { dateFormatString: nextDateFormat.formatString },
      }));
    }

    return dispatch(action);
  };
}
