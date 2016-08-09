import {
  RECEIVE_RAW_DATA_INIT,
  RECEIVE_CHART_DATA_INIT,
  RECEIVE_CHART_OPTIONS_INIT,
  RECEIVE_CHART_METADATA_INIT,
  RECEIVE_API_DATA,
} from '../constants';
import { receiveMessage, setupPostMessage } from '../utils/postMessage';

export default function actionTrigger(type, data) {
  return { type, data };
}

/**
 * Listen for data from parent window postMessage when building chart
 */
export function bootstrapAppData() {
  // init postMessage connection with parent window
  setupPostMessage();

  return function(dispatch) {
    /**
     * Send each data component to reducer
     */
    receiveMessage('bootstrap.rawData', (evt) =>
      dispatch(actionTrigger(RECEIVE_RAW_DATA_INIT, evt.data.data || ''))
    );
    receiveMessage('bootstrap.chartData', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_DATA_INIT, evt.data.data || []))
    );
    receiveMessage('bootstrap.chartOptions', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_OPTIONS_INIT, evt.data.data || {}))
    );
    receiveMessage('bootstrap.chartMetadata', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_METADATA_INIT, evt.data.data || {}))
    );
  };
}

/**
 * Get widget data from API
 */
export function bootstrapWidgetData(widgetId, fetchUrl, headersAttr = null) {
  return function(dispatch) {
    function handleResponse(response) {
      return response.status === 200 ? response.json() : {};
    }

    function handleJson(json) {
      if (!json.success || !json.data) {
        const errMsg = json.data && json.data.message ?
          json.data.message : 'Unknown API error';
        throw new Error(errMsg);
      }

      const apiData = {};
      try {
        apiData.data = JSON.parse(json.data.data);
      } catch (err) {
        console.log(err.message); // eslint-disable-line no-console
        return;
      }

      try {
        apiData.options = JSON.parse(json.data.options);
      } catch (err) {
        console.log(err.message); // eslint-disable-line no-console
        return;
      }

      try {
        apiData.metadata = JSON.parse(json.data.metadata);
      } catch (err) {
        console.log(err.message); // eslint-disable-line no-console
        return;
      }

      dispatch(actionTrigger(
        RECEIVE_API_DATA, { widget: widgetId, data: apiData }));
    }
    /**
     * async data request
     */
    let headers = {};
    if (headersAttr) {
      try {
        headers = JSON.parse(headersAttr);
      } catch (err) {
        console.log(`Invalid widget headers attr: ${headersAttr}`); // eslint-disable-line no-console
        headers = {};
      }
    }
    return fetch(fetchUrl, { headers })
      .then(handleResponse)
      .then(handleJson);
  };
}
