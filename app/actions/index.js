import {
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_METADATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_API_DATA,
} from '../constants';
import { receiveMessage } from '../utils/postMessage';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapAppData() {
  return function(dispatch) {
    function handleBootstrapMessage(evt) {
      dispatch(actionTrigger(
        RECEIVE_RAW_DATA, evt.data.rawData || ''));
      dispatch(actionTrigger(
        RECEIVE_CHART_DATA, evt.data.chartData || []));
      dispatch(actionTrigger(
        RECEIVE_CHART_OPTIONS, evt.data.chartOptions || {}));
      dispatch(actionTrigger(
        RECEIVE_CHART_METADATA, evt.data.chartMetadata || {}));
    }

    receiveMessage('bootstrapAppData', (evt) =>
      handleBootstrapMessage(evt)
    );
  };
}

export function bootstrapWidgetData(widgetId, fetchUrl) {
  return function(dispatch) {
    /**
     * async data request
     */
    return fetch(fetchUrl)
      .then((response) => response.json())
      .then((json) => dispatch(
        actionTrigger(RECEIVE_API_DATA, { widget: widgetId, data: json }))
      );
  };
}
