import * as actions from '../constants';

export default {
  [actions.UPDATE_CURRENT_STEP]: 'currentStep',
  [actions.RECEIVE_ERROR]: 'errorCode',
  [actions.CLEAR_ERROR]: 'errorCode',
  [actions.RECEIVE_RAW_DATA]: 'rawData',
  [actions.PARSE_RAW_DATA]: 'parsedData',
  [actions.PARSE_DATA_FIELDS]: 'dataFields',
  [actions.PARSE_DATA_STATUS]: 'dataStatus',
  [actions.TRANSFORM_DATA]: 'transformedData',
  [actions.RECEIVE_CHART_TYPE]: 'chartType',
  [actions.RECEIVE_CHART_DATA]: 'chartData',
  [actions.RECEIVE_CHART_OPTIONS]: 'chartOptions',
  [actions.RECEIVE_DEFAULTS_APPLIED_TO]: 'defaultsAppliedTo',
  [actions.RECEIVE_CHART_OPTIONS_EXTEND]: 'chartOptions',
  [actions.DELETE_CHART_OPTIONS]: 'chartOptions',
  [actions.RECEIVE_CHART_METADATA]: 'chartMetadata',
};
