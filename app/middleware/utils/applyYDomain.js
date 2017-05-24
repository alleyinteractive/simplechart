import update from 'immutability-helper';
import getRangeDomain from '../../utils/dataFormats/getRangeDomain';

/**
 * Need to setup yDomain for NVD3 chart that requires YAXis
 * @param {Object} typeConfig Chart type config
 * @return {Boolean}
 */
export function shouldSetupYDomain(typeConfig) {
  return 0 === typeConfig.dataFormat.indexOf('nvd3') &&
    -1 !== typeConfig.modules.settings.indexOf('YAxis');
}

/**
 * add nicely rounded yDomain to chart options, if chart has a yAxis
 * @param {Object} chartOptions
 * @param {Object} typeConfig
 * @param {Object[]}  chartData
 * @return {Object} Cloned chart options object with new yDomain
 */
export default function applyYDomain(chartOptions, typeConfig, chartData) {
  if (!shouldSetupYDomain(typeConfig)) {
    return chartOptions;
  }

  let yDomain;
  if (typeConfig.hasOwnProperty('getNiceDomain')) {
    yDomain = typeConfig.getNiceDomain(typeConfig.dataFormat, chartData);
  } else {
    yDomain = getRangeDomain(typeConfig.dataFormat, chartData);
  }

  /**
   * @todo Recalculate yDomain when series visibility is toggled by clicking on dots in the legend
   */
  return update(chartOptions, { yDomain: { $set: yDomain } });
}
