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
import chartDataReducer from './chartDataReducer';
import chartMetadataReducer from './chartMetadataReducer';
import currentStepReducer from './currentStepReducer';
import unsavedChangesReducer from './unsavedChangesReducer';

export default combineReducers({
  rawData: rawDataReducer,
  parsedData: parsedDataReducer,
  dataStatus: dataStatusReducer,
  dataFields: fieldsReducer,
  chartOptions: chartOptionsReducer,
  chartData: chartDataReducer,
  chartMetadata: chartMetadataReducer,
  currentStep: currentStepReducer,
  unsavedChanges: unsavedChangesReducer,
});
