import { RECEIVE_CHART_DATA } from '../constants';

export default function parsedDataReducer(state = '', action) {
  switch (action.type) {
    case RECEIVE_CHART_DATA: {
      return action.data;
    }
    default:
      return state;
  }
}
