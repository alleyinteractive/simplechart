import {
  RECEIVE_RAW_DATA,
  RECEIVE_RAW_DATA_INIT,
  PARSE_RAW_DATA,
  PARSE_DATA_STATUS,
  PARSE_DATA_FIELDS,
  TRANSFORM_DATA,
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../constants';
import actionTrigger from '../actions';
import Papa from '../vendor/papaparse.4.1.2';
import { dataTransformers } from '../constants/dataTransformers';

export default function rawDataMiddleware() {
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
      const parserResult = _parseRawData(action.data);

      // Case 2: CSV parsing error(s)
      if (parserResult[2].length) {
        storeUpdates.dataStatus = {
          status: 'error',
          message: parserResult[2].join('; '),
        };
        next(actionTrigger(RECEIVE_ERROR, 'e001'));
      } else {
        // Case 3: CSV parsing success
        storeUpdates.dataFields = parserResult[1];
        storeUpdates.dataStatus = {
          status: 'success',
          message: 'Data input successful',
        };
        storeUpdates.parsedData = parserResult[0];
        storeUpdates.transformedData =
          _transformParsedData(parserResult[0], parserResult[1]);
        next(actionTrigger(CLEAR_ERROR));
      }
    }
    // Empty for Case 1 and Case 2, array of fields for Case 3
    next(actionTrigger(PARSE_DATA_FIELDS, storeUpdates.dataFields));

    // Empty for Case 1, error for Case 2, success for Case 3
    next(actionTrigger(PARSE_DATA_STATUS, storeUpdates.dataStatus));

    // Empty for Case 1 and Case 2, array of data for Case 3
    next(actionTrigger(PARSE_RAW_DATA, storeUpdates.parsedData));

    // Empty for Case 1 and Case 2, object w compatible data formats for Case 3
    next(actionTrigger(TRANSFORM_DATA, storeUpdates.transformedData));

    return next(action);
  };
}

/**
 * Parse data and check for errors
 */
function _parseRawData(rawData) {
  const parsed = Papa.parse(rawData, {
    header: true,
    skipEmptyLines: true,
  });

  const errors = [];
  if (parsed.errors.length) {
    parsed.errors.forEach((error) =>
      errors.push(
        0 <= error.row ? `${error.message} at row ${error.row}` : error.message
      )
    );
  }
  const fields = parsed.meta.fields || [];
  return [parsed.data, fields, errors];
}

function _transformParsedData(parsedData, parsedFields) {
  const transformed = {};
  function setTransformed(type) {
    transformed[type] = dataTransformers[type](parsedData, parsedFields);
  }
  Object.keys(dataTransformers).forEach((type) =>
    setTransformed(type)
  );
  return transformed;
}
