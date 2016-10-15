/**
 * Chart types registry
 */
import update from 'react-addons-update';

export const selectableChartTypes = [
  {
    type: 'pieChart',
    label: 'Pie Chart',
    dataFormat: 'nvd3SingleSeries',
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

const defaultOpts = {
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
  return update(defaultOpts[typeObj.dataFormat],
    { $merge: { type: typeObj.type } });
}
