import {
  RECEIVE_RAW_DATA,
  PARSE_RAW_DATA,
} from '../constants';
import actionTrigger from '../actions';

export default function rawDataMiddleware() {
  return (next) => (action) => {
    const store = next(action);
    if (action.type === RECEIVE_RAW_DATA) {
      next(actionTrigger(
        PARSE_RAW_DATA,
        _parseRawData(action.data)
      ));
    }
    return store;
  };
}

function _parseRawData(rawData) {
  console.log(rawData, '_parseRawData');
  return rawData;
}
