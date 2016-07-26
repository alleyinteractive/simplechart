/**
 * General actions
 */
export const REQUEST_DATA = 'REQUEST_DATA';
export const UPDATE_CURRENT_STEP = 'UPDATE_CURRENT_STEP';
export const UNSAVED_CHANGES = 'UNSAVED_CHANGES';

/**
 * Widget actions
 */
export const RECEIVE_API_DATA = 'RECEIVE_API_DATA';
export const RECEIVE_WIDGET_OPTIONS = 'RECEIVE_WIDGET_OPTIONS';

/**
 * DataInput actions
 */
// string from DataInput textarea
export const RECEIVE_RAW_DATA = 'RECEIVE_RAW_DATA';
// parse raw data to JSON
export const PARSE_RAW_DATA = 'PARSE_RAW_DATA';
export const PARSE_DATA_FIELDS = 'PARSE_DATA_FIELDS';
// error or success from parsing
export const PARSE_DATA_STATUS = 'PARSE_DATA_STATUS';
// transform parsed data for chart types
export const TRANSFORM_DATA = 'TRANSFORM_DATA';

/**
 * Chart rendering actions
 */
// data transformed for chart type
export const RECEIVE_CHART_DATA = 'RECEIVE_CHART_DATA';
// chart options
export const RECEIVE_CHART_OPTIONS = 'RECEIVE_CHART_OPTIONS';
// delete specific keys from chart options
export const DELETE_CHART_OPTIONS = 'DELETE_CHART_OPTIONS';
// chart metadata
export const RECEIVE_CHART_METADATA = 'RECEIVE_CHART_METADATA';

/**
 * Actions that affect chart data that we want to store
 */
export const CHART_ACTIONS = [
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_METADATA,
];
