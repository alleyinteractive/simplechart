/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import rawDataReducer from './rawDataReducer';
import parsedDataReducer from './parsedDataReducer';
import dataStatusReducer from './dataStatusReducer';
import fieldsReducer from './fieldsReducer';
import chartOptionsReducer from './chartOptionsReducer';

export default combineReducers({
  rawData: rawDataReducer,
  data: parsedDataReducer,
  dataStatus: dataStatusReducer,
  fields: fieldsReducer,
  chartOptions: chartOptionsReducer,
});
