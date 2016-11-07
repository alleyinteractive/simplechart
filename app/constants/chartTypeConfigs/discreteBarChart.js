export const config = {
  type: 'discreteBarChart',
  label: 'Bar Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  showLegend: false,
};
