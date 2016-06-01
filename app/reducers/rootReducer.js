/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import rawDataReducer from './rawDataReducer';
import parsedDataReducer from './parsedDataReducer';
import dataStatusReducer from './dataStatusReducer';

export default combineReducers({
  rawData: rawDataReducer,
  parsedData: parsedDataReducer,
  dataStatus: dataStatusReducer,
});
