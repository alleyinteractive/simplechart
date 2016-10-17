import {
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_DATA_INIT,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_INIT,
  SELECT_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
import { getChartTypeDefaultOpts } from '../constants/chartTypes';

export default function selectChartTypeMiddleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== SELECT_CHART_TYPE) {
      return dispatch(action);
    }

    // use init options action if we don't already have a chart type
    // If we do have a chart type already, note that chartOptions
    // object is *not* cleared when chart type changes, e.g.
    // if you select pieChart, then chartOptions.donut = true,
    // then select discreteBarChart, you will still see
    // chartOptions.donut === true even though donut is not a relevant
    // option for bar charts
    const optsAction = (getState().chartOptions.type &&
      getState().chartOptions.type.length) ?
      RECEIVE_CHART_OPTIONS : RECEIVE_CHART_OPTIONS_INIT;

    // send default options to store chartOptions
    dispatch(actionTrigger(optsAction,
      getChartTypeDefaultOpts(action.data.type)));

    // use init data action if no data yet
    const dataAction = (0 < getState().chartData.length) ?
      RECEIVE_CHART_DATA : RECEIVE_CHART_DATA_INIT;

    // send formatted data to store chartData
    dispatch(actionTrigger(dataAction,
      getState().transformedData[action.data.dataFormat]));

    return dispatch(action);
  };
}
