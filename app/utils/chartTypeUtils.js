/**
 * Chart types registry
 */
import update from 'react-addons-update';
import { selectableChartTypes, nvd3Defaults } from '../constants/chartTypes';

export function getChartTypeObject(type) {
  return selectableChartTypes.reduce((prev, current) =>
    (type === current.config.type ? current : prev),
    null
  );
}

export function getChartTypeDefaultOpts(type) {
  const typeObj = getChartTypeObject(type);

  // Options for NVD3-based chart types
  if (0 === typeObj.config.dataFormat.indexOf('nvd3')) {
    // merge chart type into data format defaults
    let returnOpts = update(nvd3Defaults[typeObj.config.dataFormat],
      { $merge: { type: typeObj.config.type } });
    // add any specific defaults if present
    if (typeObj.defaultOpts && 0 < Object.keys(typeObj.defaultOpts).length) {
      returnOpts = update(returnOpts, { $merge: typeObj.defaultOpts });
    }
    return returnOpts;
  }

  // non-NVD3 data formats would do something else here
  return {};
}
