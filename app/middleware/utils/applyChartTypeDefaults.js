/**
 * Middleware that applies chart type default options and handles some special cases
 */
import { getChartTypeDefaultOpts } from '../../utils/chartTypeUtils';
import update from 'react-addons-update';

export default function applyChartTypeDefaults(
  chartTypeConfig,
  chartOptions,
  defaultsAppliedTo
) {
  /**
   * @todo Handle defaults that would break with a shallow merge
   */
  function _mergeStateIntoDefaults() {
    return update(
      getChartTypeDefaultOpts(chartTypeConfig.type),
      { $merge: chartOptions }
    );
  }

  /**
   * @todo Handle defaults that would fail with a shallow merge
   */
  function _mergeDefaultsIntoState() {
    return update(
      chartOptions,
      { $merge: getChartTypeDefaultOpts(chartTypeConfig.type) }
    );
  }

  switch (defaultsAppliedTo) {
    // Already applied for this chart type
    case chartTypeConfig.type:
      return chartOptions;

    // None applied yet
    case '':
      return _mergeDefaultsIntoState();

    // Previously applied for a different chart type
    default:
      return _mergeStateIntoDefaults();
  }
}
