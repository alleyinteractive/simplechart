import actionTrigger from '../actions';
import {
  BOOTSTRAP_APP,
  RECEIVE_ERROR,
  RECEIVE_DEFAULTS_APPLIED_TO,
  RECEIVE_CMS_STATUS,
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_CHART_METADATA,
} from '../constants';
import update from 'immutability-helper';
import { getChartTypeObject, getChartTypeDefaultOpts } from './chartTypeUtils';
import defaultPalette from '../constants/defaultPalette';
import applyTickFormatters from '../reducers/utils/applyTickFormatters';
import { defaultTickFormatSettings } from '../constants/defaultTickFormatSettings';

/**
 * Handle bootstrapping the Redux store with data from a postMessage,
 * i.e. a chart previously saved in the CMS
 *
 * @param {Function} dispatch Send to Redux
 * @param {String} messageType Should be bootstrap.new or bootstrap.edit
 * @param {Object} recdData Data received from parent window
 */
export default function bootstrapStore(dispatch, messageType, recdData) {
  const isNewChart = 'bootstrap.new' === messageType;
  let nextChartType = {};
  let nextOpts = update({}, { $set: recdData.chartOptions });

  // TODO: Most of the logic in this file should live in a reducer.
  // Refactor towards a centralized "bootstrap" action.
  dispatch(actionTrigger(BOOTSTRAP_APP, recdData, messageType));

  /**
   * Set up chartType config object with
   * fallback to NVD3 options.type for backwards compatibility
   */
  if (!isNewChart) {
    const chartType = recdData.chartType || recdData.chartOptions.type;
    nextChartType = update(nextChartType, {
      $set: getChartTypeObject(chartType) || {},
    });
    if (!Object.keys(nextChartType).length) {
      // error if missing or misconfigured chart type
      dispatch(actionTrigger(RECEIVE_ERROR, 'e005', messageType));
      return;
    }
  }

  /**
   * @todo If chartType is _not_ NVD3, handle all this stuff differently
   */

  /**
   * Merge received options into default chart type options to reset
   * any functions that disappeared when object was stringified
   */
  if (!isNewChart) {
    nextOpts = update(
      getChartTypeDefaultOpts(nextChartType.config.type),
      { $merge: nextOpts }
    );
    dispatch(actionTrigger(
      RECEIVE_DEFAULTS_APPLIED_TO,
      nextChartType.config.type,
      messageType
    ));
  }

  /**
   * Reset tick formatting
   */
  if (!nextOpts.hasOwnProperty('tickFormatSettings')) {
    // Applies static defaults if needed
    nextOpts.tickFormatSettings = defaultTickFormatSettings;
  } else {
    // Backfill settings with defaults in case anything is missing
    nextOpts = update(nextOpts, { tickFormatSettings: {
      $apply: (savedSettings) =>
        update(defaultTickFormatSettings, { $merge: savedSettings }),
    } });
  }

  // Turn static values into formatting functions
  // applyTickFormatters() returns a cloned object
  nextOpts = applyTickFormatters(nextOpts, nextChartType.config);

  /**
   * Apply default colors if needed
   */
  if (!nextOpts.color) {
    nextOpts = update(nextOpts, { $merge: {
      color: defaultPalette,
    } });
  }

  /**
   * Dispatch to store when not empty
   */
  dispatch(actionTrigger(RECEIVE_CMS_STATUS, messageType, messageType));

  // Handle rawData differently because it's a string
  if (recdData.rawData && recdData.rawData.length) {
    dispatch(actionTrigger(RECEIVE_RAW_DATA, recdData.rawData, messageType));
  }

  // If object defined and not empty, dispatch to store
  [
    { action: RECEIVE_CHART_OPTIONS, data: nextOpts },
    { action: RECEIVE_CHART_TYPE, data: nextChartType },
    { action: RECEIVE_CHART_METADATA, data: recdData.chartMetadata },
  ].forEach((item) => {
    if (undefined !== item.data && Object.keys(item.data).length) {
      dispatch(actionTrigger(item.action, item.data, messageType));
    }
  });
}
