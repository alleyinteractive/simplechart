/**
 * Middleware that selects a data array from transformedData according to the dataFormat
 * of the selected chart type.
 */

import {
  TRANSFORM_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';

export default function setChartData({ getState }) {
  return (dispatch) => (action) => {
    /**
     * If we are receiving chart type config and
     * already have transformed data to choose from, dispatch chartData
     */
    function _handleReceiveChartType() {
      if (getState().transformedData[action.data.config.dataFormat]) {
        dispatch(actionTrigger(
          RECEIVE_CHART_DATA,
          getState().transformedData[action.data.config.dataFormat]
        ));
      }
    }

    /**
     * If we are receiving transformed data and
     * we already have a chart type config to use, dispatch chartData
     */
    function _handleTransformData() {
      if (getState().chartType.config &&
        getState().chartType.config.dataFormat &&
        action.data[getState().chartType.config.dataFormat]
      ) {
        dispatch(actionTrigger(
          RECEIVE_CHART_DATA,
          action.data[getState().chartType.config.dataFormat]
        ));
      }
    }

    if (RECEIVE_CHART_TYPE === action.type) {
      _handleReceiveChartType();
    } else if (TRANSFORM_DATA === action.type) {
      _handleTransformData();
    }

    return dispatch(action);
  };
}
