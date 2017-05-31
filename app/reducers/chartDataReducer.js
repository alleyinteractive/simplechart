import { get } from 'lodash';
import update from 'immutability-helper';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE, TRANSFORM_DATA } from '../constants';
import { dataIsMultiSeries, loopArrayItemAtIndex } from '../utils/misc';

export default function chartDataReducer(state = {}, action) {
  const { chartData, chartOptions, chartType, transformedData } = state;
  let newChartData = chartData;

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      if (checkShouldApplyColors(state, action)) {
        newChartData = reduceChartData(
          chartData,
          chartType.config.dataFormat,
          transformedData,
          action.data.color
        );
      }
      break;
    }

    case RECEIVE_CHART_TYPE: {
      newChartData = reduceChartData(
        chartData,
        action.data.config.dataFormat,
        transformedData,
        chartOptions.color
      );
      break;
    }

    case TRANSFORM_DATA: {
      newChartData = reduceChartData(
        chartData,
        (chartType.config || {}).dataFormat,
        action.data,
        chartOptions.color
      );
      break;
    }

    default:
  }

  return update(state, { chartData: { $set: newChartData } });
}

function reduceChartData(chartData, dataFormat, transformedData, colors = []) {
  const format = dataFormat || findFirstAvailableFormat(transformedData);
  if (!format) {
    return chartData;
  }

  if ('nvd3MultiSeries' === dataFormat) {
    return applyColorsToData(colors, transformedData[format]);
  }

  return transformedData[format];
}

function checkShouldApplyColors(state, action) {
  if (!action.data.hasOwnProperty('color')) {
    return false;
  }

  // Don't apply if data format isn't NVD3 multi series
  if ('nvd3MultiSeries' !== get(state, 'chartType.config.dateFormat')) {
    return false;
  }

  // Apply if update came from manual user change
  if ('PalettePicker' === action.src) {
    return true;
  }

  // Test if at least one series doesn't have a color already
  const hasNoColor = state.chartData.find((series) => !series.hasOwnProperty('color'));
  return !!hasNoColor;
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

function findFirstAvailableFormat(transformedData) {
  return Object
    .keys(transformedData)
    .find((format) => !!transformedData[format]);
}
