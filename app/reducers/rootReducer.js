/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import rawDataReducer from './rawDataReducer';
import parsedDataReducer from './parsedDataReducer';
import dataStatusReducer from './dataStatusReducer';

export default combineReducers({
  data: dataReducer,
  rawData: rawDataReducer,
  parsedData: parsedDataReducer,
  dataStatus: dataStatusReducer,
});
