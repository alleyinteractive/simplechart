/**
 * Chart types registry
 */
import update from 'immutability-helper';
import { selectableChartTypes, nvd3Defaults } from '../constants/chartTypes';

export function getChartTypeObject(type) {
  return selectableChartTypes.reduce((prev, current) =>
    (type === current.config.type ? current : prev),
    null
  );
}

export function getChartTypeDefaultOpts(type) {
  const typeObj = getChartTypeObject(type);

  const defaultOpts = {
    type: typeObj.config.type,
  };

  // Options for NVD3-based chart types
  if (0 === typeObj.config.dataFormat.indexOf('nvd3')) {
    // merge chart type into data format defaults
    let returnOpts = update(defaultOpts, {
      $merge: nvd3Defaults[typeObj.config.dataFormat],
    });
    // add any specific defaults if present
    if (typeObj.defaultOpts && 0 < Object.keys(typeObj.defaultOpts).length) {
      returnOpts = update(returnOpts, { $merge: typeObj.defaultOpts });
    }
    return returnOpts;
  }

  // non-NVD3 data formats would do something else here
  return defaultOpts;
}
