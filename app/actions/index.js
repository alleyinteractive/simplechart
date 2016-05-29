import {
  REQUEST_DATA,
  RECEIVE_DATA,
} from '../constants';

export default function actionTrigger(type, data) {
  return { type, data };
}

export function bootstrapData() {
  return function(dispatch) {
    dispatch(actionTrigger(REQUEST_DATA));

    /**
     * AJAX data request
     */
    return fetch('/static/sampleData.json')
      .then((response) => response.json())
      .then((json) => dispatch(actionTrigger(RECEIVE_DATA, json)));
  };
}
