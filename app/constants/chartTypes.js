/**
 * Chart types registry
 */
import update from 'react-addons-update';

export const selectableChartTypes = [
  {
    type: 'pieChart',
    label: 'Pie Chart',
    dataFormat: 'nvd3SingleSeries',
    defaultOpts: {
      donut: true,
    },
  },
  {
    type: 'discreteBarChart',
    label: 'Bar Chart',
    dataFormat: 'nvd3SingleSeries',
  },
  {
    type: 'lineChart',
    label: 'Line Chart',
    dataFormat: 'nvd3MultiSeries',
  },
];

const nvd3Defaults = {
  nvd3SingleSeries: {
    x: (d) => d.label,
    y: (d) => d.value,
  },
  nvd3MultiSeries: {
    x: (d) => d.x,
    y: (d) => d.y,
  },
};

export function getChartTypeObject(type) {
  for (const typeObj of selectableChartTypes) {
    if (type === typeObj.type) {
      return typeObj;
    }
  }
  return null;
}

export function getChartTypeDefaultOpts(type) {
  const typeObj = getChartTypeObject(type);
  if (typeObj.dataFormat.indexOf('nvd3') === 0) {
    // merge chart type into data format defaults
    let returnOpts = update(nvd3Defaults[typeObj.dataFormat],
      { $merge: { type: typeObj.type } });
    // add any specific defaults if present
    if (typeObj.defaultOpts) {
      returnOpts = update(returnOpts, { $merge: typeObj.defaultOpts });
    }
    return returnOpts;
  }
  /**
   * non-NVD3 data formats would do something else here
   */
  return {};
}
