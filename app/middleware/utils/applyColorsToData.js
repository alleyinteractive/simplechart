import { dataIsMultiSeries } from '../../utils/misc';

/**
 * For nvd3MultiSeries dataFormat, loop through and apply a color to each series
 */
export default function applyColorsToData(colors = [], data = []) {
  if (!data.length || !dataIsMultiSeries(data) || !colors.length) {
    return data;
  }

  function _getColorForIndex(seriesIndex) {
    let color;
    let iteration = 0;
    while (!color) {
      const colorsIndex = seriesIndex - (iteration * colors.length);
      if (colorsIndex < colors.length) {
        color = colors[colorsIndex];
      } else {
        iteration++;
      }
    }
    return color;
  }

  return data.map((series, idx) => {
    series.color = _getColorForIndex(idx); // eslint-disable-line no-param-reassign
    return series;
  });
}
