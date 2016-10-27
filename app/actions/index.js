import {
  RECEIVE_RAW_DATA,
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_OPTIONS_INIT,
  RECEIVE_CHART_METADATA,
  RECEIVE_WIDGET,
  RECEIVE_WIDGET_DATA,
  RECEIVE_WIDGET_OPTIONS,
  RECEIVE_WIDGET_METADATA,
} from '../constants';
import { receiveMessage, setupPostMessage } from '../utils/postMessage';

/**
 * For IE11 support
 */
import fetch from 'isomorphic-fetch';
import { polyfill } from 'es6-promise'; polyfill();

export default function actionTrigger(type, data, src = '') {
  return { type, data, src };
}

/**
 * Listen for data from parent window postMessage when building chart
 */
export function bootstrapAppData() {
  // init postMessage connection with parent window
  setupPostMessage();

  return function setupReceiveMessage(dispatch) {
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
      dispatch(actionTrigger(RECEIVE_CHART_OPTIONS_INIT, evt.data.data || {}))
    );
    receiveMessage('bootstrap.chartMetadata', (evt) =>
      dispatch(actionTrigger(RECEIVE_CHART_METADATA, evt.data.data || {}))
    );
  };
}

/**
 * Get widget data from API
 */
export function ajaxWidgetData(widgetId, fetchUrl, headersAttr = null) {
  return function setupHandleJson(dispatch) {
    function handleResponse(response) {
      return 200 === parseInt(response.status, 10) ? response.json() : {};
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
        RECEIVE_WIDGET, { widget: widgetId, data: apiData }));
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

/*
 * Setup listener for individual widget to receive all or partial data
 */
export function listenerWidgetData(widgetEl, dispatch) {
  function receiveData(evt) {
    evt.stopPropagation();
    if (!evt.detail) {
      return;
    }
    // If full complete widget data is present
    if (evt.detail.data && evt.detail.options && evt.detail.metadata) {
      dispatch(actionTrigger(RECEIVE_WIDGET,
        { widget: widgetEl.id, data: evt.detail }));
    } else {
      // Otherwse, dispatch individual pieces of data object
      if (evt.detail.data) {
        dispatch(actionTrigger(RECEIVE_WIDGET_DATA,
          { widget: widgetEl.id, data: evt.detail.data }));
      }
      if (evt.detail.options) {
        dispatch(actionTrigger(RECEIVE_WIDGET_OPTIONS,
          { widget: widgetEl.id, data: evt.detail.options }));
      }
      if (evt.detail.metadata) {
        dispatch(actionTrigger(RECEIVE_WIDGET_METADATA,
          { widget: widgetEl.id, data: evt.detail.metadata }));
      }
    }
  }
  widgetEl.addEventListener('widgetData', receiveData, true);
}
