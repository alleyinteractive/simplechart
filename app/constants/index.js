/**
 * General actions
 */
export const REQUEST_DATA = 'REQUEST_DATA';
export const UPDATE_CURRENT_STEP = 'UPDATE_CURRENT_STEP';

/**
 * Widget actions
 */
export const RECEIVE_API_DATA = 'RECEIVE_API_DATA';

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

/**
 * Chart rendering actions
 */
// data transformed for chart type
export const RECEIVE_CHART_DATA = 'RECEIVE_CHART_DATA';
// chart options
export const RECEIVE_CHART_OPTIONS = 'RECEIVE_CHART_OPTIONS';
// chart metadata
export const RECEIVE_CHART_METADATA = 'RECEIVE_CHART_METADATA';
