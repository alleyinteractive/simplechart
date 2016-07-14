import {
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_METADATA,
  RECEIVE_API_DATA,
} from '../constants';
import { receiveMessage } from '../utils/postMessage';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapAppData() {
  return function(dispatch) {
    /**
     * Send each data component to reducer
     */
    receiveMessage('bootstrap.rawData', (evt) =>
      dispatch(actionTrigger(RECEIVE_RAW_DATA, evt.data.data || ''))
    );
    receiveMessage('bootstrap.chartData', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_DATA, evt.data.data || []))
    );
    receiveMessage('bootstrap.chartOptions', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, evt.data.data || {}))
    );
    receiveMessage('bootstrap.chartMetadata', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_METADATA, evt.data.data || {}))
    );
  };
}

export function bootstrapWidgetData(widgetId, fetchUrl) {
  return function(dispatch) {
    function handleResponse(response) {
      return response.status === 200 ? response.json() : {};
    }
    /**
     * async data request
     */
    return fetch(fetchUrl)
      .then((response) => handleResponse(response))
      .then((json) => dispatch(
        actionTrigger(RECEIVE_API_DATA, { widget: widgetId, data: json }))
      );
  };
}
