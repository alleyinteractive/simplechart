import update from 'immutability-helper';
import {
  EDITING_CHART_ANNOTATIONS,
  RECEIVE_CHART_ANNOTATION,
  RECEIVE_UPDATED_ANNOTATION_DATA,
  RECEIVE_REMOVE_ANNOTATION,
} from '../constants';

export default function chartAnnotationsReducer(state, action) {
  switch (action.type) {
    case RECEIVE_CHART_ANNOTATION: {
      const annotations =
        state.chartAnnotations.annotationData.slice()
          .map((annotation, index) => ({ ...annotation, id: index }));
      annotations.push({
        ...action.data,
        id: annotations.length,
      });
      return update(state, {
        chartAnnotations: {
          annotationData: { $set: annotations },
        },
      });
    }
    case RECEIVE_UPDATED_ANNOTATION_DATA: {
      const { id } = action.data;
      const annotations = state.chartAnnotations.annotationData.slice();
      const { data, color } = annotations[id];
      const {
        note,
        connector,
        x,
        y,
        dx,
        dy,
        subject,
      } = action.data;
      annotations.splice(id, 1, {
        id,
        note,
        connector,
        x,
        y,
        dx,
        dy,
        subject,
        data,
        color,
      });
      return update(state, {
        chartAnnotations: {
          annotationData: { $set: annotations },
        },
      });
    }
    case RECEIVE_REMOVE_ANNOTATION: {
      const annotations = state.chartAnnotations.annotationData.slice();
      annotations.splice(action.data, 1);
      return update(state, {
        chartAnnotations: {
          annotationData: { $set: annotations },
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
