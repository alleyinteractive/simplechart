/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
import { createGenericReducer, createComposedReducer } from './genericReducers';
import chartOptionsReducer from './chartOptionsReducer';
import chartDataReducer from './chartDataReducer';
import rawDataReducer from './rawDataReducer';
import unsavedChangesReducer from './unsavedChangesReducer';
import bootstrapReducer from './bootstrapReducer';
import * as actions from '../constants';

export const initialState = {
  chartData: [],
  chartMetadata: {},
  chartOptions: {
    dateFormat: {
      enabled: false,
      validated: false,
      formatString: '',
    },
    color: [],
  },
  chartType: {},
  cmsStatus: '',
  currentStep: 0,
  dataFields: [],
  dataStatus: {},
  errorCode: '',
  googleApiKey: null,
  googleSheetId: null,
  helpDocument: '',
  parsedData: [],
  rawData: '',
  transformedData: {},
  unsavedChanges: false,
};

const setActionReducer = createGenericReducer('$set', {
  [actions.RECEIVE_CHART_METADATA]: 'chartMetadata',
  [actions.RECEIVE_CMS_STATUS]: 'cmsStatus',
  [actions.UPDATE_CURRENT_STEP]: 'currentStep',
  [actions.PARSE_DATA_FIELDS]: 'dataFields',
  [actions.PARSE_DATA_STATUS]: 'dataStatus',
  [actions.RECEIVE_ERROR]: 'errorCode',
  [actions.RECEIVE_HELP_DOCUMENT]: 'helpDocument',
  [actions.PARSE_RAW_DATA]: 'parsedData',
  [actions.RECEIVE_RAW_DATA]: 'rawData',
  [actions.TRANSFORM_DATA]: 'transformedData',
  [actions.REQUEST_GOOGLE_SHEET]: 'googleSheetId',
});

const clearActionMap = {
  [actions.CLEAR_ERROR]: 'errorCode',
  [actions.CLEAR_HELP_DOCUMENT]: 'helpDocument',
};

const clearActionReducer = createGenericReducer(
  '$set',
  clearActionMap,
  (data, property) => initialState[property]
);

export default createComposedReducer([
  setActionReducer,
  clearActionReducer,
  unsavedChangesReducer,
  bootstrapReducer,
  rawDataReducer,
  chartDataReducer,
  chartOptionsReducer,
]);
