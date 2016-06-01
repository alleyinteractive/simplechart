import { RECEIVE_CHART_FIELDS } from '../constants';

export default function dataFieldsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_FIELDS: {
      return action.data;
    }
    default:
      return state;
  }
}
