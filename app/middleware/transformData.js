/**
 * TRANSFORM_DATA middleware. If we have a chart type config
 * with dataFormat, dispatch chartData to store
 */

import { TRANSFORM_DATA } from '../constants';
import dispatchChartData from './utils/dispatchChartData';

export default function setChartData({ getState }) {
  return (dispatch) => (action) => {
    if (TRANSFORM_DATA === action.type) {
      dispatchChartData(
        dispatch,
        getState().chartType.config || {},
        action.data,
        getState().chartOptions.color
      );
    }
    return dispatch(action);
  };
}
