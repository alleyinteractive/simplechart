import {
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../constants';

export default function errorReducer(state = '', action) {
  switch (action.type) {
    case RECEIVE_ERROR:
      return action.data;

    case CLEAR_ERROR:
      return '';

    default:
      return state;
  }
}
