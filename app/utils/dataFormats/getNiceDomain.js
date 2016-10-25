import { min, max, scale } from 'd3';

/**
 * Get [min, max] array for data series in nvd3SingleSeries or nvd3MultiSeries format
 *
 * @param array series Data series
 * @param string format Data format
 * @return array Range of [min, max] for series
 */
function _getSeriesDomain(series, format) {
  const values = [];
  const key = 'nvd3SingleSeries' === format ? 'value' : 'y';
  series.forEach((point) =>
    values.push(point[key])
  );
  return [min(values), max(values)];
}

function _getMultiSeriesDomain(series, format) {
  const mins = [];
  const maxs = [];
  series.forEach((singleSeries) => {
    const domain = _getSeriesDomain(singleSeries.values, format);
    mins.push(domain[0]);
    maxs.push(domain[1]);
  });
  return [min(mins), max(maxs)];
}

function _makeNice(range) {
  return scale.linear().domain(range).nice().domain();
}

/**
 * Get "nice" rounded domain from dataset
 *
 * @param string format Data format from chart config object
 * @param array data Chart data transformed for data format
 * @return array Domain array of [min, max] values
 */
export default function getNiceDomain(format, data) {
  const domain = 'nvd3SingleSeries' === format ?
    _getSeriesDomain(data, format) : _getMultiSeriesDomain(data, format);
  return _makeNice(domain);
}
