import update from 'react-addons-update';
import getNiceDomain from '../../utils/dataFormats/getNiceDomain';

/**
 * Need to setup yDomain for NVD3 chart that requires YAXis
 * @param object typeConfig Chart type config
 * @return bool
 */
export function shouldSetupYDomain(typeConfig) {
  return 0 === typeConfig.dataFormat.indexOf('nvd3') &&
    -1 !== typeConfig.modules.settings.indexOf('YAxis');
}

/**
 * add nicely rounded yDomain to chart options, if chart has a yAxis
 * @param obj chartOptions
 * @param obj typeConfig
 * @param array chartData
 * @return obj Cloned chart options object with new yDomain
 */
export default function applyYDomain(chartOptions, typeConfig, chartData) {
  if (!shouldSetupYDomain(typeConfig)) {
    return chartOptions;
  }

  /**
   * @todo Recalculate yDomain when series visibility is toggled by clicking on dots in the legend
   */
  return update(chartOptions, { yDomain: {
    $set: getNiceDomain(typeConfig.dataFormat, chartData),
  } });
}
