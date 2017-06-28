import fetch from 'isomorphic-fetch';
import { polyfill } from 'es6-promise';
import {
  RECEIVE_ERROR,
  RECEIVE_CMS_STATUS,
  RECEIVE_WIDGET,
  RECEIVE_WIDGET_DATA,
  RECEIVE_WIDGET_OPTIONS,
  RECEIVE_WIDGET_METADATA,
  UPDATE_CURRENT_STEP,
} from '../constants';
import { receiveMessage, setupPostMessage, sendMessage } from '../utils/postMessage';
import bootstrapStore from '../utils/bootstrapStore';
import { ownsProperties } from '../utils/misc';

// For IE11 support
polyfill();

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
     * Confirm data formatting then bootstrap the store
     */
    function validateEvt(evt) {
      return evt.data && ownsProperties(evt.data, ['data', 'messageType']);
    }

    function initBootstrap(evt) {
      if (validateEvt(evt)) {
        bootstrapStore(dispatch, evt.data.messageType, evt.data.data);
      } else {
        dispatch(actionTrigger(RECEIVE_ERROR, 'e005'));
      }
    }

    // Bootstrap chart editor from plugin postMessage
    receiveMessage('bootstrap.edit', initBootstrap);
    receiveMessage('bootstrap.new', initBootstrap);
    receiveMessage('cms.isSaving', (evt) => {
      if (validateEvt(evt)) {
        dispatch(actionTrigger(RECEIVE_CMS_STATUS, 'cms.isSaving'));
      }
    });

     // Handle messages from outdated plugin script
    receiveMessage('bootstrap.rawData', () =>
      dispatch(actionTrigger(RECEIVE_ERROR, 'e005'))
    );
    receiveMessage('bootstrap.chartData', () =>
      dispatch(actionTrigger(RECEIVE_ERROR, 'e005'))
    );
    receiveMessage('bootstrap.chartOptions', () =>
      dispatch(actionTrigger(RECEIVE_ERROR, 'e005'))
    );
    receiveMessage('bootstrap.chartMetadata', () =>
      dispatch(actionTrigger(RECEIVE_ERROR, 'e005'))
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

export function closeApp() {
  return (dispatch) => {
    sendMessage('closeApp');
    dispatch(actionTrigger(UPDATE_CURRENT_STEP, 0));
  };
}

export { default as requestGoogleSheet } from './requestGoogleSheet';
