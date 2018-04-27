import update from 'immutability-helper';
import { EDITING_CHART_ANNOTATIONS, RECEIVE_CHART_ANNOTATION } from '../constants';

export default function chartAnnotationsReducer(state, action) {
  switch (action.type) {
    case RECEIVE_CHART_ANNOTATION: {
      const annotations = state.chartAnnotations.annotations.slice();
      annotations.push(action.data);
      return update(state, {
        chartAnnotations: {
          annotations: { $set: annotations },
        },
      });
    }
    case EDITING_CHART_ANNOTATIONS: {
      return update(state, {
        chartAnnotations: {
          editing: { $set: action.data },
        },
      });
    }
    default:
      return state;
  }
}
