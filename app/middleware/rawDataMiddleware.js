import {
  RECEIVE_RAW_DATA,
  PARSE_RAW_DATA,
  PARSE_DATA_STATUS,
} from '../constants';
import actionTrigger from '../actions';
import Papa from '../vendor/papaparse.4.1.2';

export default function rawDataMiddleware() {
  return (next) => (action) => {
    const store = next(action);
    if (action.type === RECEIVE_RAW_DATA && action.data.length) {
      const parsedData = _parseRawData(action.data);

      // send parser result to store
      next(actionTrigger(
        PARSE_RAW_DATA,
        parsedData[0]
      ));

      // send parse status
      let statusObj;
      if (parsedData[1].length) {
        statusObj = {
          status: 'error',
          message: parsedData[1].join('; '),
        };
      } else {
        statusObj = {
          status: 'success',
          message: 'Data successfully parsed!',
        };
      }
      next(actionTrigger(
        PARSE_DATA_STATUS,
        statusObj
      ));
    }
    return store;
  };
}

/**
 * Parse data and check for errors
 */
function _parseRawData(rawData) {
  const parsed = Papa.parse(rawData, {
    header: true,
  });

  const errors = [];
  if (parsed.errors.length) {
    parsed.errors.forEach((error) =>
      errors.push(
        error.row >= 0 ? `${error.message} at row ${error.row}` : error.message
      )
    );
  }
  return [parsed, errors];
}
