import { min, max, scale } from 'd3';

/**
 * Get [min, max] array for data series in nvd3SingleSeries or nvd3MultiSeries format
 *
 * @param {Array} series Data series
 * @param {String} format Data format
 * @return {Array} Range of [min, max] for series
 */
function getSeriesDomain(series, format) {
  const key = 'nvd3SingleSeries' === format ? 'value' : 'y';
  const values = series.map((point) => point[key]);
  return [min(values), max(values)];
}

function getMultiSeriesDomain(series, format) {
  const mins = [];
  const maxs = [];
  series.forEach((singleSeries) => {
    const domain = getSeriesDomain(singleSeries.values, format);
    mins.push(domain[0]);
    maxs.push(domain[1]);
  });
  return [min(mins), max(maxs)];
}

function makeNice(range) {
  return scale.linear().domain(range).nice().domain();
}

/**
 * Get "nice" rounded domain from dataset
 *
 * @param {String} format Data format from chart config object
 * @param {Object[]} data Chart data transformed for data format
 * @return {Array} Domain array of [min, max] values
 */
export default function getRangeDomain(format, data) {
  const domain = 'nvd3SingleSeries' === format ?
    getSeriesDomain(data, format) : getMultiSeriesDomain(data, format);
  return makeNice(domain);
}
