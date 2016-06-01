import { RECEIVE_CHART_OPTIONS } from '../constants';
import update from 'react-addons-update';

export default function dataFieldsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return update(state, { $merge: action.data });
    }
    default:
      return state;
  }
}
