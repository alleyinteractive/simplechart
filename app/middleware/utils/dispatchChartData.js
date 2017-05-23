import { RECEIVE_CHART_DATA } from '../../constants';
import actionTrigger from '../../actions';
import applyColorsToData from './applyColorsToData';

/**
 * Check for chart type dataFormat and transformed data, then dispatch to chartData
 */
export default function dispatchChartData(
  dispatch,
  chartTypeConfig,
  transformedData,
  colors = [],
  src = ''
) {
  if (chartTypeConfig &&
    chartTypeConfig.dataFormat &&
    transformedData[chartTypeConfig.dataFormat]
  ) {
    // Apply colors to data if applicable
    const nextData = ('nvd3MultiSeries' === chartTypeConfig.dataFormat) ?
        applyColorsToData(colors, transformedData[chartTypeConfig.dataFormat]) :
        transformedData[chartTypeConfig.dataFormat];

    dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      nextData,
      src
    ));
  }
}
