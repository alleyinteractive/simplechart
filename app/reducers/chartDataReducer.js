import { RECEIVE_CHART_DATA, RECEIVE_CHART_DATA_INIT } from '../constants';

export default function chartDataReducer(state = [], action) {
  switch (action.type) {
    case RECEIVE_CHART_DATA_INIT:
    case RECEIVE_CHART_DATA: {
      return action.data;
    }
    default:
      return state;
  }
}
