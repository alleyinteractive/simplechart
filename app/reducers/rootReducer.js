/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE, TRANSFORM_DATA } from '../constants';
import { combineReducers } from 'redux';
import { baseReducer, mergeReducer } from './genericReducers';
import chartOptionsReducer from './chartOptionsReducer';
import setClearReducer from './setClearReducer';
import applyColorsToData from '../middleware/utils/applyColorsToData';
import * as actions from '../constants';

const defaultReducer = combineReducers({
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

export default function rootReducer(state, action) {
  let newState = state;

  switch (action) {
    case RECEIVE_CHART_OPTIONS: {
      newState = {};
      break;
    }

    case RECEIVE_CHART_TYPE: {
      newState = {

      };
      break;
    }

    case TRANSFORM_DATA: {
      newState = reduceChartData(
        state.chartData,
        state.chartType.config,
        action.data,
        state.chartOptions.color
      );
      break;
    }

    default:
      break;
  }

  return defaultReducer(newState, action);
}

function reduceChartData(chartData, dataFormat, transformedData, colors = []) {
  if (!dataFormat) {
    return chartData;
  }

  if ('nvd3MultiSeries' === dataFormat) {
    return applyColorsToData(colors, transformedData[dataFormat]);
  }

  return transformedData[dataFormat];
}

function _shouldDispatchChartData() {
  return !getState().chartData.length || // chartData not already set up
    !getState().chartType.config || //  chartType not already set up
    !getState().chartType.config.dataFormat || // chartType didn't have dataFormat
    getState().chartType.config.dataFormat !== nextConfig.dataFormat; // dataFormat has changed
}

/**
 * Send chartData to store if dataFormat has changed
 */
if (_shouldDispatchChartData()) {
  console.log('from chart type');
  dispatchChartData(
    dispatch,
    nextConfig,
    getState().transformedData,
    getState().chartOptions.color,
    action.src
  );
}
