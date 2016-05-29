import {
  RECEIVE_DATA,
} from '../constants';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapData(widgetId, fetchUrl) {
  return function(dispatch) {
    /**
     * async data request
     */
    return fetch(fetchUrl)
      .then((response) => response.json())
      .then((json) => dispatch(
        actionTrigger(RECEIVE_DATA, { widget: widgetId, data: json }))
      );
  };
}
