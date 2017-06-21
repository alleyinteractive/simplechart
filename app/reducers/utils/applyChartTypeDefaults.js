/**
 * Middleware that applies chart type default options and handles some special cases
 */
import { getChartTypeDefaultOpts } from '../../utils/chartTypeUtils';
import update from 'immutability-helper';

export default function applyChartTypeDefaults(chartTypeConfig, chartOptions) {
  // In case we got no chart type, or defaults already set for this chart type
  if (!chartTypeConfig || !chartTypeConfig.type) {
    return chartOptions;
  }

  // Merge defaults into state
  /**
   * @todo Handle defaults that would break with a shallow merge
   * and be smarter about not overwriting edited options that would
   * be reset to defaults here
   */
  return update(
    chartOptions,
    { $merge: getChartTypeDefaultOpts(chartTypeConfig.type) }
  );
}
