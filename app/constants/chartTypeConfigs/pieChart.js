export const config = {
  type: 'pieChart',
  label: 'Pie Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Single',
  settingsComponent: 'PieChartSettings',
  modules: {
    settings: ['Legend'],
  },
};

export const defaultOpts = {
  donut: true,
  showLegend: true,
  showLabels: false,
};
