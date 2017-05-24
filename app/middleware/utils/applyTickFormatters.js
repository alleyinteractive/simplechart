import update from 'immutability-helper';
import createFormatter from '../../utils/createFormatter';
import * as dateUtils from '../../utils/parseDate';

/**
 * Merge formatter func into yAxis settings
 */
export function _getYAxis(axisSettings, formatter, typeConfig) {
  if (
    formatter &&
    typeConfig.modules &&
    typeConfig.modules.settings &&
    -1 !== typeConfig.modules.settings.indexOf('YAxis')
  ) {
    return update(axisSettings, { $merge: { tickFormat: formatter } });
  }
  return {};
}

/**
 * Merge date formatting func into xAxis
 */
export function _getXAxis(axisSettings, dateFormatString) {
  return update(axisSettings, { $merge: {
    tickFormat: (ts) => dateUtils.format(ts, dateFormatString),
  } });
}

export default function applyTickFormatters(chartOptions, typeConfig) {
  if (!typeConfig) {
    return chartOptions;
  }

  const toUpdate = {};
  let formatter = null;

  // Y Axis formatting
  if (chartOptions.tickFormatSettings) {
    formatter = createFormatter(chartOptions.tickFormatSettings);
    toUpdate.yAxis = _getYAxis(
      chartOptions.yAxis || {},
      formatter,
      typeConfig
    );
  }

  // X Axis date formatting
  if (chartOptions.xAxis && chartOptions.xAxis.dateFormatString) {
    toUpdate.xAxis = _getXAxis(
      chartOptions.xAxis || {},
      chartOptions.xAxis.dateFormatString
    );
  }

  // set single series valueFormat if applicable
  if ('nvd3SingleSeries' === typeConfig.dataFormat && formatter) {
    toUpdate.valueFormat = formatter;
  }

  return update(chartOptions, { $merge: toUpdate });
}
