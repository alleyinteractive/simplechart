import createFormatter from '../../utils/createFormatter';
import update from 'react-addons-update';

function _getFormattingOpts(formatter, chartOptions, typeConfig) {
  if (!typeConfig.modules ||
    !typeConfig.modules.settings ||
    -1 === typeConfig.modules.settings.indexOf('YAxis')
  ) {
    return {};
  }

  return {
    yAxis: update(chartOptions.yAxis || {}, {
      tickFormat: { $set: formatter },
    }),
    valueFormat: 'nvd3SingleSeries' === typeConfig.dataFormat ? formatter : null,
  };
}

/**
 * Clone chart options including data formatting functions created from tickFormatSettings
 *
 * @param obj chartOptions Complete chart options object
 * @param obj typeConfig Chart type configuration
 * @retur obj Cloned chart options object with data formatting functions
 */
export default function applyDataFormatters(chartOptions, typeConfig) {
  if (!chartOptions.tickFormatSettings) {
    return chartOptions;
  }
  // create data formatter function
  const formatter = createFormatter(chartOptions.tickFormatSettings);

  // Merge updated yAxis and valueFormat into cloned options object
  return update(chartOptions, {
    $merge: _getFormattingOpts(formatter, chartOptions, typeConfig),
  });
}
