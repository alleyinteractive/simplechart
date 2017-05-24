import update from 'react-addons-update';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE, TRANSFORM_DATA } from '../constants';
import { dataIsMultiSeries, loopArrayItemAtIndex } from '../utils/misc';

export default function chartDataReducer(state, action) {
  let chartData = state.chartData;

  switch (action) {
    case RECEIVE_CHART_OPTIONS: {
      if (checkShouldApplyColors(state, action)) {
        chartData = reduceChartData(
          state.chartType.config,
          state.transformedData,
          action.data.color
        );
      }
      break;
    }

    case RECEIVE_CHART_TYPE: {
      if (checkShouldDispatchChartData(state, action)) {
        chartData = reduceChartData(
          action.data.config,
          state.transformedData,
          state.chartOptions.color
        );
      }
      break;
    }

    case TRANSFORM_DATA: {
      chartData = reduceChartData(
        state.chartData,
        state.chartType.config,
        action.data,
        state.chartOptions.color
      );
      break;
    }

    default:
  }

  return update(state, { $set: { chartData } });
}

function reduceChartData(chartData, dataFormat, transformedData, colors = []) {
  if (!dataFormat) {
    return chartData;
  }

  if ('nvd3MultiSeries' === dataFormat) {
    return applyColorsToData(colors, transformedData[dataFormat]);
  }

  return transformedData[dataFormat];
}

function checkShouldDispatchChartData(state, action) {
  return !state.chartData.length || // chartData not already set up
    !state.chartType.config || //  chartType not already set up
    !state.chartType.config.dataFormat || // chartType didn't have dataFormat
    state.chartType.config.dataFormat !== action.data.config.dataFormat; // dataFormat has changed
}

function checkShouldApplyColors(state, action) {
  let shouldApply;
  try {
    if ('nvd3MultiSeries' !== state.chartType.config.dataFormat) {
      // Don't apply if data format isn't NVD3 multi series
      shouldApply = false;
    } else if ('PalettePicker' === action.src) {
      // Apply if update came from manual user change
      shouldApply = true;
    } else {
      // Test if at least one series doesn't have a color already
      shouldApply = state.chartData.reduce((acc, series) =>
          (acc || !series.hasOwnProperty('color'))
        , false);
    }
  } catch (err) {
    shouldApply = false;
  }

  return action.data.hasOwnProperty('color') && shouldApply;
}

/**
 * For nvd3MultiSeries dataFormat, loop through and apply a color to each series
 */
export function applyColorsToData(colors = [], data = []) {
  if (!data.length || !dataIsMultiSeries(data) || !colors.length) {
    return data;
  }

  return data.map((series, idx) =>
    Object.assign({}, series, { color: loopArrayItemAtIndex(idx, colors) })
  );
}
