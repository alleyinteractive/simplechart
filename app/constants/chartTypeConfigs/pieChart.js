export const config = {
  type: 'pieChart',
  label: 'Pie Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'PieChart',
  settingsComponent: 'PieChartSettings',
  modules: {
    settings: ['Legend'],
  },
};

export const defaultOpts = {
  donut: true,
  showLegend: false,
  showLabels: false,
};
