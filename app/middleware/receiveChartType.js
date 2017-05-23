/**
 * RECEIVE_CHART_TYPE middleware
 */

import {
  RECEIVE_CHART_TYPE,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_DEFAULTS_APPLIED_TO,
} from '../constants';
import dispatchChartData from './utils/dispatchChartData';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';
import applyTickFormatters from './utils/applyTickFormatters';
import applyYDomain from './utils/applyYDomain';
import actionTrigger from '../actions';

export default function receiveChartType({ getState }) {
  return (dispatch) => (action) => {
    if (RECEIVE_CHART_TYPE !== action.type) {
      return dispatch(action);
    }
    const nextConfig = action.data.config;

    /**
     * Dispatch chart data if chartData not already set up
     * or if dataFormat has changed
     */
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

    /**
     * Setup chart type default options if NOT bootstrapping from postMessage
     */

    if (0 !== action.src.indexOf('bootstrap')) {
      let nextOpts = applyChartTypeDefaults(
        nextConfig,
        getState().chartOptions,
        getState().defaultsAppliedTo
      );

      /**
       * set yDomain if chartData is set up
       */
      if (0 < getState().chartData.length) {
        nextOpts = applyYDomain(nextOpts, nextConfig, getState().chartData);
      }

      /**
       * Apply tick formatting and return cloned opts object
       */
      nextOpts = applyTickFormatters(
        nextOpts,
        nextConfig,
        getState().dateFormat
      );

      dispatch(actionTrigger(
        RECEIVE_CHART_OPTIONS, nextOpts, action.src));
      dispatch(actionTrigger(
        RECEIVE_DEFAULTS_APPLIED_TO, nextConfig.type, action.src));
    }

    return dispatch(action);
  };
}
