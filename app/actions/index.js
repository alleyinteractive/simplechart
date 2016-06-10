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

      const rawData = evt.data.rawData || '';
      const chartData = evt.data.chartData || [];
      const chartOptions = evt.data.chartOptions || {};
      const chartMetadata = evt.data.chartMetadata || {};

      dispatch(actionTrigger(RECEIVE_RAW_DATA, rawData));
      dispatch(actionTrigger(RECEIVE_CHART_DATA, chartData));
      dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, chartOptions));
      dispatch(actionTrigger(RECEIVE_CHART_METADATA, chartMetadata));
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
