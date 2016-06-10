import {
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_METADATA,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_API_DATA,
} from '../constants';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapAppData() {
  return function(dispatch) {
    function handleMessage(evt) {
      if (evt.origin !== window.location.origin) {
        throw new Error(`Illegal postMessage from ${evt.origin}`);
      }

      if (!evt.data.messageType ||
        evt.data.messageType !== 'bootstrapAppData') {
        return;
      }

      dispatch(actionTrigger(
        RECEIVE_RAW_DATA, evt.data.rawData || ''));
      dispatch(actionTrigger(
        RECEIVE_CHART_DATA, evt.data.chartData || []));
      dispatch(actionTrigger(
        RECEIVE_CHART_OPTIONS, evt.data.chartOptions || {}));
      dispatch(actionTrigger(
        RECEIVE_CHART_METADATA, evt.data.chartMetadata || {}));
    }

    window.addEventListener('message', (evt) =>
      handleMessage(evt)
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
