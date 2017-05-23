import {
  RECEIVE_RAW_DATA,
  PARSE_RAW_DATA,
  PARSE_DATA_STATUS,
  PARSE_DATA_FIELDS,
  TRANSFORM_DATA,
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../constants';
import actionTrigger from '../actions';
import Papa from '../vendor/papaparse.4.1.2';
import { parseRawData, transformParsedData } from '../utils/rawDataHelpers';

export default function rawDataMiddleware({ getState }) {
  return (next) => (action) => {
    if (action.type !== RECEIVE_RAW_DATA) {
      return next(action);
    }

    const storeUpdates = {
      dataFields: [],
      dataStatus: {},
      parsedData: [],
      transformedData: {},
    };
    if (!action.data.length) {
      // Case 1: Empty text area
      next(actionTrigger(CLEAR_ERROR));
    } else {
      const [data, fields, errors] = parseRawData(Papa, action.data);

      // Case 2: CSV parsing error(s)
      if (errors.length) {
        storeUpdates.dataStatus = {
          status: 'error',
          message: errors.join('; '),
        };
        next(actionTrigger(RECEIVE_ERROR, 'e001'));
      } else {
        // Case 3: CSV parsing success
        storeUpdates.dataFields = fields;
        storeUpdates.dataStatus = {
          status: 'success',
          message: 'Data input successful',
        };
        storeUpdates.parsedData = data;
        storeUpdates.transformedData = transformParsedData(
          data,
          fields,
          getState().dateFormat
        );
        next(actionTrigger(CLEAR_ERROR));
      }
    }
    // Empty for Case 1 and Case 2, array of fields for Case 3
    next(actionTrigger(
      PARSE_DATA_FIELDS, storeUpdates.dataFields, action.src));

    // Empty for Case 1, error for Case 2, success for Case 3
    next(actionTrigger(
      PARSE_DATA_STATUS, storeUpdates.dataStatus, action.src));

    // Empty for Case 1 and Case 2, array of data for Case 3
    next(actionTrigger(
      PARSE_RAW_DATA, storeUpdates.parsedData, action.src));

    // Empty for Case 1 and Case 2, object w compatible data formats for Case 3
    next(actionTrigger(
      TRANSFORM_DATA, storeUpdates.transformedData, action.src));

    return next(action);
  };
}
