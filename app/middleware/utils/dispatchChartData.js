import { RECEIVE_CHART_DATA } from '../../constants';
import actionTrigger from '../../actions';

/**
 * Check for chart type dataFormat and transformed data, then dispatch to chartData
 */
export default function dispatchChartData(
  chartTypeConfig,
  transformedData,
  dispatch
) {
  if (chartTypeConfig &&
    chartTypeConfig.dataFormat &&
    transformedData[chartTypeConfig.dataFormat]
  ) {
    dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      transformedData[chartTypeConfig.dataFormat]
    ));
  }
}
