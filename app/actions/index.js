import {
  RECEIVE_RAW_DATA,
  RECEIVE_API_DATA,
} from '../constants';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapAppData() {
  return function(dispatch) {
    /**
     * @todo check for app being in iframe and listen for postMessage
     * i.e. when editing a previously built chart
     */
    dispatch(actionTrigger(RECEIVE_RAW_DATA, ''));
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
