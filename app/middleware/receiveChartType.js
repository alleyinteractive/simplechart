/**
 * RECEIVE_CHART_TYPE middleware
 */

import { RECEIVE_CHART_TYPE } from '../constants';
import dispatchChartData from './utils/dispatchChartData';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';

export default function receiveChartType({ getState }) {
  return (dispatch) => (action) => {
    if (RECEIVE_CHART_TYPE !== action.type) {
      return dispatch(action);
    }
    const nextConfig = action.data.config;

    /**
     * Send chartData to store if dataFormat has changed
     */
    if (!getState().chartType.config ||
      !getState().chartType.config.dataFormat ||
      getState().chartType.config.dataFormat !== nextConfig.dataFormat
    ) {
      dispatchChartData(
        dispatch,
        nextConfig,
        getState().transformedData,
        getState().chartOptions.color
      );
    }

    /**
     * Setup chart type default options
     */
    applyChartTypeDefaults(nextConfig, getState, dispatch);

    return dispatch(action);
  };
}
