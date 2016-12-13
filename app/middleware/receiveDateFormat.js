import {
  RECEIVE_DATE_FORMAT,
  TRANSFORM_DATA,
} from '../constants';
import actionTrigger from '../actions';
import { transformParsedData } from '../utils/rawDataHelpers';
import update from 'react-addons-update';

/**
 * Re-apply data transformers if we've enabled a valid date formatting string
 */
export default function receiveDateFormatMiddleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== RECEIVE_DATE_FORMAT) {
      return dispatch(action);
    }

    const nextDateFormat = update(getState().dateFormat, {
      $merge: action.data,
    });

    if (nextDateFormat.enabled &&
      nextDateFormat.validated &&
      nextDateFormat.formatString
    ) {
      const transformedData = transformParsedData(
        getState().parsedData,
        getState().dataFields,
        nextDateFormat
      );
      dispatch(actionTrigger(TRANSFORM_DATA, transformedData));
    }

    return dispatch(action);
  };
}
