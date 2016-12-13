import update from 'react-addons-update';
import createFormatter from '../../utils/createFormatter';
import * as dateUtils from '../../utils/parseDate';

function _getAxesConfig(formatter, chartOptions, typeConfig, dateFormat) {
  const axesConfig = {};

  // Merge into existing axis settings if needed
  if (formatter && typeConfig.modules && typeConfig.modules.settings) {
    if (-1 !== typeConfig.modules.settings.indexOf('YAxis')) {
      axesConfig.yAxis = update(chartOptions.yAxis || {}, {
        $merge: { tickFormat: formatter },
      });
    }
  }

  if (dateFormat.enabled && dateFormat.validated) {
    const dateFunc = (ts) => dateUtils.format(ts, dateFormat.formatString);
    axesConfig.xAxis = update(chartOptions.xAxis || {}, {
      $merge: {
        tickFormat: dateFunc,
        dateFormatString: dateFormat.formatString,
      },
    });
  }

  return axesConfig;
}

export default function applyDataFormatters(
  chartOptions,
  typeConfig,
  dateFormat
) {
  if (!typeConfig) {
    return chartOptions;
  }

  // create data formatter function
  let formatter;
  if (chartOptions && chartOptions.tickFormatSettings) {
    formatter = createFormatter(chartOptions.tickFormatSettings);
  }

  // clone chartOptions.xAxis and chartOptions.yAxis as needed
  // and including formatter function
  const toUpdate = _getAxesConfig(
    formatter,
    chartOptions,
    typeConfig,
    dateFormat
  );

  // set single series valueFormat if applicable
  if ('nvd3SingleSeries' === typeConfig.dataFormat) {
    toUpdate.valueFormat = formatter;
  }

  return update(chartOptions, { $merge: toUpdate });
}
