/**
 * Multi-series data (e.g. line charts) need to have a color associated with each series
 * This middleware maps the array of colors in chart.options.color to the series in the chart.data array
 */
import {
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_OPTIONS,
} from '../constants';
import { dataIsMultiSeries } from '../utils/misc';
import update from 'react-addons-update';
import actionTrigger from '../actions';

function applyColorsToData(colors = [], data = []) {
  if (!data.length || !dataIsMultiSeries(data) || !colors.length) {
    return data;
  }

  function _getColorForIndex(seriesIndex) {
    let color;
    let iteration = 0;
    while (!color) {
      const colorsIndex = seriesIndex - (iteration * colors.length);
      if (colorsIndex < colors.length) {
        color = colors[colorsIndex];
      } else {
        iteration++;
      }
    }
    return color;
  }

  return data.map((series, idx) => {
    series.color = _getColorForIndex(idx); // eslint-disable-line no-param-reassign
    return series;
  });
}

export default function middleware({ getState }) {
  return (dispatch) => (action) => {
    // If receiving chart data and colors are set, apply before dispatching to store
    if (RECEIVE_CHART_DATA === action.type && getState().chartOptions.color) {
      action = update(action, { data: {  // eslint-disable-line no-param-reassign
        $set: applyColorsToData(getState().chartOptions.color, action.data),
      } });
    }

    // If receiving options with colors and data is set, apply colors to data
    if (RECEIVE_CHART_OPTIONS === action.type &&
      action.data.color &&
      getState().chartData.length
    ) {
      dispatch(actionTrigger(
        RECEIVE_CHART_DATA,
        applyColorsToData(action.data.color, getState().chartData)
      ));
    }

    return dispatch(action);
  };
}
