import {
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../constants';

export default function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ERROR:
      return action.data;

    case CLEAR_ERROR:
      return '';

    default:
      return state;
  }
}
