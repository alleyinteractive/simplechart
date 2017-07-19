export const config = {
  type: 'pieChart',
  label: 'Pie Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Adapter',
  settingsComponent: 'PieChartSettings',
  modules: {
    settings: ['Legend', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  donut: false,
  showLegend: true,
  showLabels: false,
};

export default {
  config,
  defaultOpts,
};
