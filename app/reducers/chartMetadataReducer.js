import { RECEIVE_CHART_METADATA } from '../constants';

export default function chartMetadataReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CHART_METADATA: {
      return action.data;
    }
    default:
      return state;
  }
}