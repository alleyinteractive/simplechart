/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import { baseReducer, mergeReducer } from './genericReducers';
import chartOptionsReducer from './chartOptionsReducer';
import setClearReducer from './setClearReducer';
import * as actions from '../constants';

export default combineReducers({
  chartData: baseReducer([], [actions.RECEIVE_CHART_DATA]),
  chartMetadata: baseReducer({}, [actions.RECEIVE_CHART_METADATA]),
  chartOptions: chartOptionsReducer,
  chartType: baseReducer({}, [actions.RECEIVE_CHART_TYPE]),
  cmsStatus: baseReducer('', [actions.RECEIVE_CMS_STATUS]),
  currentStep: baseReducer(0, [actions.UPDATE_CURRENT_STEP]),
  dateFormat: mergeReducer({}, [actions.RECEIVE_DATE_FORMAT]),
  defaultsAppliedTo: baseReducer('', [actions.RECEIVE_DEFAULTS_APPLIED_TO]),
  dataFields: baseReducer([], [actions.PARSE_DATA_FIELDS]),
  dataStatus: baseReducer({}, [actions.PARSE_DATA_STATUS]),
  errorCode: setClearReducer('',
    actions.RECEIVE_ERROR, actions.CLEAR_ERROR),
  helpDocument: setClearReducer('',
    actions.RECEIVE_HELP_DOCUMENT, actions.CLEAR_HELP_DOCUMENT),
  parsedData: baseReducer([], [actions.PARSE_RAW_DATA]),
  rawData: baseReducer('', [actions.RECEIVE_RAW_DATA]),
  transformedData: baseReducer({}, [actions.TRANSFORM_DATA]),
  unsavedChanges: baseReducer(false, [actions.UNSAVED_CHANGES]),
});
