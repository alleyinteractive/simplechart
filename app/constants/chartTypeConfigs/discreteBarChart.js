export const config = {
  type: 'discreteBarChart',
  label: 'Bar Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['Annotations'],
    // settings: ['XAxis', 'YAxis', 'Metadata', 'ColorPalette', 'Annotations'],
  },
};

export const defaultOpts = {
  showLegend: false,
};

export default {
  config,
  defaultOpts,
};
