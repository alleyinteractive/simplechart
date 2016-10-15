import {
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_DATA_INIT,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_INIT,
  SELECT_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
import { getChartTypeDefaultOpts } from '../constants/chartTypes';

export default function({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== SELECT_CHART_TYPE) {
      return dispatch(action);
    }

    // use init options action if we don't already have a chart type
    const optsAction = getState().chartOptions.type &&
      getState().chartOptions.type.length ?
      RECEIVE_CHART_OPTIONS : RECEIVE_CHART_OPTIONS_INIT;

    // send default options to store chartOptions
    dispatch(actionTrigger(optsAction,
      getChartTypeDefaultOpts(action.data.type)));

    // use init data action if no data yet
    const dataAction = getState().chartData.length > 0 ?
      RECEIVE_CHART_DATA : RECEIVE_CHART_DATA_INIT;

    // send formatted data to store chartData
    dispatch(actionTrigger(dataAction,
      getState().transformedData[action.data.dataFormat]));

    return dispatch(action);
  };
}
