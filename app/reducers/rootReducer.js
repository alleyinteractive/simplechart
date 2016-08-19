/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import baseReducer from './baseReducer';
import chartOptionsReducer from './chartOptionsReducer';

export default combineReducers({
  chartData: (state, action) => baseReducer(state, action, []),
  chartMetadata: (state, action) => baseReducer(state, action, {}),
  chartOptions: chartOptionsReducer,
  currentStep: (state, action) => baseReducer(state, action, 0),
  dataFields: (state, action) => baseReducer(state, action, []),
  dataStatus: (state, action) => baseReducer(state, action, {}),
  initializedOpts: (state, action) => baseReducer(state, action, false),
  parsedData: (state, action) => baseReducer(state, action, []),
  rawData: (state, action) => baseReducer(state, action, ''),
  transformedData: (state, action) => baseReducer(state, action, {}),
  unsavedChanges: (state, action) => baseReducer(state, action, false),
});
