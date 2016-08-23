import {
  RECEIVE_CHART_DATA,
  RECEIVE_CHART_DATA_INIT,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_INIT,
} from '../constants';
import { dataIsMultiSeries } from '../utils/misc';
import update from 'react-addons-update';

function applyColorsToData(colors, data) {
  if (!data.length || !dataIsMultiSeries(data)) {
    return data;
  }

  const newData = update(data, { $merge: {} });

  colors.forEach((color, index) => {
    if (index < newData.length) {
      newData[index].color = color;
    }
  });
  return newData;
}

export default function middleware(store) {
  return (next) => (action) => {
    const result = next(action);

    switch (action.type) {
      case RECEIVE_CHART_DATA:
      case RECEIVE_CHART_DATA_INIT:
        result.data = applyColorsToData(
          store.getState().chartOptions.color || [], result.data);
        break;

      case RECEIVE_CHART_OPTIONS:
      case RECEIVE_CHART_OPTIONS_INIT:
        // if store.getState().chartData and colors array, apply using colors-specific action
        break;

      default:
        // do nothing.
    }

    return result;
  };
}
