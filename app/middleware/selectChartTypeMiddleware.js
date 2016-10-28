import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
import { getChartTypeDefaultOpts } from '../utils/chartTypeUtils';
import update from 'react-addons-update';
import getNiceDomain from '../utils/dataFormats/getNiceDomain';

/**
 * Need to setup yDomain for NVD3 chart that requires YAXis
 * unless it's already been set up
 * @param object chartType Chart type config
 * @param object storedOptions Current chartOptions in store
 * @return bool
 */
function _shouldSetupYDomain(chartConfig, storedOptions) {
  return 0 === chartConfig.dataFormat.indexOf('nvd3') &&
    -1 !== chartConfig.modules.settings.indexOf('YAxis') &&
    'undefined' === typeof storedOptions.yDomain;
}

export default function selectChartTypeMiddleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== RECEIVE_CHART_TYPE) {
      return dispatch(action);
    }

    // Note that chartOptions
    // object is *not* cleared when chart type changes, e.g.
    // if you select pieChart, then chartOptions.donut = true,
    // then select discreteBarChart, you will still see
    // chartOptions.donut === true even though donut is not a relevant
    // option for bar charts
    // use init data action if no data yet

    // send default options to store chartOptions
    let chartTypeOpts = getChartTypeDefaultOpts(action.data.config.type);
    if (_shouldSetupYDomain(action.data.config, getState().chartOptions)) {
      /**
       * @todo Recalculate yDomain when series visibility is toggled by clicking on dots in the legend
       */
      chartTypeOpts = update(chartTypeOpts, { $merge: {
        yDomain: getNiceDomain(
          action.data.config.dataFormat,
          getState().transformedData[action.data.config.dataFormat]
        ),
      } });
    }

    dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, chartTypeOpts));

    return dispatch(action);
  };
}
