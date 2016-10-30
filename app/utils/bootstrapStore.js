import actionTrigger from '../actions';
import * as actions from '../constants';
import update from 'react-addons-update';
import { getChartTypeObject, getChartTypeDefaultOpts } from './chartTypeUtils';
import createFormatter from './createFormatter';
import { capitalize } from './misc';
import defaultPalette from '../constants/defaultPalette';

function getAxesConfig(formatter, options, typeConfig) {
  const axesConfig = {};
  if (!typeConfig.modules || !typeConfig.modules.settings) {
    return axesConfig;
  }

  const toMerge = { tickFormat: formatter };
  // Merge into existing axis settings if needed
  function _setAxis(name) {
    if (-1 !== typeConfig.modules.settings.indexOf(capitalize(name))) {
      axesConfig[name] = update(options[name] || {}, { $merge: toMerge });
    }
  }
  _setAxis('xAxis');
  _setAxis('yAxis');
  return axesConfig;
}

/**
 * Handle bootstrapping the Redux store with data from a postMessage,
 * i.e. a chart previously saved in the CMS
 *
 * @param function dispatch Send to Redux
 * @param obj state Saved state as received from parent window
 */
export default function bootstrapStore(dispatch, savedData) {
  /**
   * Set up chartType config object with
   * fallback to NVD3 options.type for backwards compatibility
   */
  const nextChartType = update({}, { $set:
    getChartTypeObject(savedData.chartType || savedData.chartOptions.type),
  });
  if (!nextChartType) {
    // error if missing or misconfigured chart type
    dispatch(actionTrigger(actions.RECEIVE_ERROR, 'e005'));
    return;
  }

  /**
   * @todo If chartType is _not_ NVD3, handle all this stuff differently
   */

  /**
   * Merge saved options into default options to reset
   * any functions that disappeared when object was stringified
   */
  let nextChartOptions = update(
    getChartTypeDefaultOpts(nextChartType.config.type),
    { $merge: savedData.chartOptions }
  );

  /**
   * Reset tick formatting that might also have been deleted
   */
  if (nextChartOptions.tickFormatBuilder) {
    const formatter = createFormatter(nextChartOptions.tickFormatBuilder);
    // set single series valueFormat if applicable
    if ('nvd3SingleSeries' === nextChartType.config.dataFormat) {
      nextChartOptions.valueFormat = formatter;
    }
    nextChartOptions = update(nextChartOptions, {
      $merge: getAxesConfig(formatter, nextChartOptions, nextChartType.config),
    });
  }

  /**
   * Apply default colors if needed
   */
  if (!nextChartOptions.color) {
    nextChartOptions = update(nextChartOptions, { $merge: {
      color: defaultPalette,
    } });
  }

  /**
   * Dispatch to store
   */
  dispatch(actionTrigger(
    actions.RECEIVE_RAW_DATA, savedData.rawData || ''));
  dispatch(actionTrigger(
    actions.RECEIVE_CHART_TYPE, nextChartType));
  dispatch(actionTrigger(
    actions.RECEIVE_CHART_OPTIONS, nextChartOptions));
  dispatch(actionTrigger(
    actions.RECEIVE_CHART_METADATA, savedData.chartMetadata || {}));
}
