import { capitalize } from '../../utils/misc';
import createFormatter from '../../utils/createFormatter';
import update from 'react-addons-update';

function _getAxesConfig(formatter, chartOptions, typeConfig) {
  const axesConfig = {};
  if (!typeConfig.modules || !typeConfig.modules.settings) {
    return axesConfig;
  }

  const toMerge = { tickFormat: formatter };
  // Merge into existing axis settings if needed
  function _setAxis(name) {
    if (-1 !== typeConfig.modules.settings.indexOf(capitalize(name))) {
      axesConfig[name] = update(chartOptions[name] || {}, { $merge: toMerge });
    }
  }
  _setAxis('xAxis');
  _setAxis('yAxis');
  return axesConfig;
}

export default function applyDataFormatters(chartOptions, typeConfig) {
  if (!chartOptions.tickFormatSettings) {
    return chartOptions;
  }
  // create data formatter function
  const formatter = createFormatter(chartOptions.tickFormatSettings);

  // clone chartOptions.xAxis and chartOptions.yAxis as needed
  // and including formatter function
  const toUpdate = _getAxesConfig(formatter, chartOptions, typeConfig);

  // set single series valueFormat if applicable
  if ('nvd3SingleSeries' === typeConfig.dataFormat) {
    toUpdate.valueFormat = formatter;
  }

  return update(chartOptions, { $merge: toUpdate });
}
