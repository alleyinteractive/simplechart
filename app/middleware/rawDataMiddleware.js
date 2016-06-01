import {
  RECEIVE_RAW_DATA,
  PARSE_RAW_DATA,
} from '../constants';
import actionTrigger from '../actions';
import Papa from '../vendor/papaparse.4.1.2';

export default function rawDataMiddleware() {
  return (next) => (action) => {
    const store = next(action);
    if (action.type === RECEIVE_RAW_DATA && action.data.length) {
      next(actionTrigger(
        PARSE_RAW_DATA,
        _parseRawData(action.data)
      ));
    }
    return store;
  };
}

function _parseRawData(rawData) {
  const parsed = Papa.parse(rawData, {
    header: true,
  });
  console.log(parsed);
  return parsed;
}
