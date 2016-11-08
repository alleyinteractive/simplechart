import { dataIsMultiSeries, loopArrayItemAtIndex } from '../../utils/misc';

/**
 * For nvd3MultiSeries dataFormat, loop through and apply a color to each series
 */
export default function applyColorsToData(colors = [], data = []) {
  if (!data.length || !dataIsMultiSeries(data) || !colors.length) {
    return data;
  }

  return data.map((series, idx) => {
    series.color = loopArrayItemAtIndex(idx, colors); // eslint-disable-line no-param-reassign
    return series;
  });
}
