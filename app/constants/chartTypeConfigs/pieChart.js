export const config = {
  type: 'pieChart',
  label: 'Pie Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'PieChart',
  modules: {
    settings: ['legend'],
  },
};

export const defaultOpts = {
  donut: true,
  showLegend: false,
  showLabels: false,
};
