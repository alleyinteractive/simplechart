import cloneDeep from 'lodash/cloneDeep';
import { RECEIVE_CHART_DATA, TRANSFORM_DATA } from '../constants';

export const initialState = [];

export default function reduceChartData(state = initialState, action) {
  if (action.type === TRANSFORM_DATA) {

  }
}
