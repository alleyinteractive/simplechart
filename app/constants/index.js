/**
 * General actions
 */
export const UPDATE_CURRENT_STEP = 'UPDATE_CURRENT_STEP';
export const UNSAVED_CHANGES = 'UNSAVED_CHANGES';

/**
 * Errors
 */
export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

/**
 * Widget actions
 */
export const RECEIVE_WIDGET = 'RECEIVE_WIDGET';
export const RECEIVE_WIDGET_DATA = 'RECEIVE_WIDGET_DATA';
export const RECEIVE_WIDGET_OPTIONS = 'RECEIVE_WIDGET_OPTIONS';
export const RECEIVE_WIDGET_METADATA = 'RECEIVE_WIDGET_METADATA';

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
// chart type object from manifest
export const SELECT_CHART_TYPE = 'SELECT_CHART_TYPE';

// data transformed for selected chart type
export const RECEIVE_CHART_DATA = 'RECEIVE_CHART_DATA';

// chart options
export const RECEIVE_CHART_OPTIONS = 'RECEIVE_CHART_OPTIONS';

// Deep-extend object into chart options
export const RECEIVE_CHART_OPTIONS_EXTEND = 'RECEIVE_CHART_OPTIONS_EXTEND';

// delete specific keys from chart options
export const DELETE_CHART_OPTIONS = 'DELETE_CHART_OPTIONS';

// chart metadata
export const RECEIVE_CHART_METADATA = 'RECEIVE_CHART_METADATA';

/**
 * Actions when a chart is updated
 */
export const CHART_UPDATE_ACTIONS = [
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_METADATA,
];
