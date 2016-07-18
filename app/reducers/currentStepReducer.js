import { UPDATE_CURRENT_STEP } from '../constants';

export default function currentStepReducer(state = 0, action) {
  switch (action.type) {
    case UPDATE_CURRENT_STEP: {
      return action.data;
    }
    default:
      return state;
  }
}
