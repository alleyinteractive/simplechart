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
import { parseRawData, transformParsedData, validateTransformedData } from '../utils/rawDataHelpers';

export default function rawDataMiddleware(store) {
  return (next) => (action) => {
    if (action.type !== RECEIVE_RAW_DATA) {
      return next(action);
    }

    const dateFormat = store.getState().dateFormat;
    const state = {
      dataFields: [],
      dataStatus: {},
      parsedData: [],
      transformedData: {},
    };

    // Case 1: Empty text area
    if (!action.data.length) {
      return dispatchRawDataState(next, action, state);
    }

    const [data, fields, errors] = parseRawData(Papa, action.data);
    const transformedDataMap = transformParsedData(
      data,
      fields,
      dateFormat
    );
    const combinedErrors = errors.concat(
      validateTransformedData(transformedDataMap)
    );

    // Case 2: CSV parsing error(s)
    if (combinedErrors.length) {
      return dispatchRawDataState(next, action, Object.assign(state, {
        dataStatus: {
          status: 'error',
          message: combinedErrors.join('; '),
        },
      }));
    }

    // Case 3: CSV parsing success
    return dispatchRawDataState(next, action, Object.assign(state, {
      dataFields: fields,
      dataStatus: {
        status: 'success',
        message: 'Data input successful',
      },
      parsedData: data,
      transformedData: transformedDataMap,
    }));
  };
}

// TODO: Move this stuff to receiveRawData reducer
function dispatchRawDataState(dispatch, action, state) {
  if ('error' !== state.dataStatus.status) {
    dispatch(actionTrigger(CLEAR_ERROR));
  } else {
    dispatch(actionTrigger(RECEIVE_ERROR, 'e001'));
  }

  // Empty for Case 1 and Case 2, array of fields for Case 3
  dispatch(actionTrigger(
    PARSE_DATA_FIELDS, state.dataFields, action.src));

  // Empty for Case 1, error for Case 2, success for Case 3
  dispatch(actionTrigger(
    PARSE_DATA_STATUS, state.dataStatus, action.src));

  // Empty for Case 1 and Case 2, array of data for Case 3
  dispatch(actionTrigger(
    PARSE_RAW_DATA, state.parsedData, action.src));

  // Empty for Case 1 and Case 2, object w compatible data formats for Case 3
  dispatch(actionTrigger(
    TRANSFORM_DATA, state.transformedData, action.src));

  return dispatch(action);
}
