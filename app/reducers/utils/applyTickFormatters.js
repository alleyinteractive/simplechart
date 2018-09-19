import get from 'lodash/fp/get';
import update from 'immutability-helper';
import createFormatter from '../../utils/createFormatter';
import * as dateUtils from '../../utils/parseDate';

/**
 * Merge formatter func into yAxis settings
 */
export function getYAxis(axisSettings, formatter, typeConfig) {
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
export function getXAxis(axisSettings, formatter) {
  return update(axisSettings, { $merge: { tickFormat: formatter } });
}

export default function applyTickFormatters(chartOptions, typeConfig) {
  if (!typeConfig) {
    return chartOptions;
  }

  const toUpdate = {};

  // Handle yAxis tickFormat and single data series valueFormat
  const ySettings = get('tickFormatSettings.yAxis', chartOptions);
  if ('undefined' !== typeof ySettings) {
    const yFormatter = createFormatter(ySettings);
    toUpdate.yAxis = getYAxis(
      chartOptions.yAxis || {},
      yFormatter,
      typeConfig
    );

    if ('nvd3SingleSeries' === typeConfig.dataFormat) {
      toUpdate.valueFormat = yFormatter;
    }
  }

  if ('nvd3SingleSeries' !== typeConfig.dataFormat) {
    // X Axis can have date formatting or data format func
    const dateFormatString = get('xAxis.dateFormatString', chartOptions);
    const dateFormatEnabled = get('dateFormat.enabled', chartOptions) || false;
    const xSettings = get('tickFormatSettings.xAxis', chartOptions);

    let xFormatter;
    if ('undefined' !== typeof dateFormatString && dateFormatEnabled) {
      xFormatter = (ts) => dateUtils.format(ts, dateFormatString);
    } else if ('undefined' !== typeof xSettings) {
      xFormatter = createFormatter(xSettings);
    }

    if ('undefined' !== typeof xFormatter) {
      toUpdate.xAxis = getXAxis(
        chartOptions.xAxis || {},
        xFormatter
      );
    }

    // multiBarHorizontalChart
    if ('multiBarHorizontalChart' === typeConfig.type) {
      toUpdate.valueFormat = xFormatter;
    }
  }

  return update(chartOptions, { $merge: toUpdate });
}
