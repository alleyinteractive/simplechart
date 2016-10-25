export const config = {
  type: 'lineChart',
  label: 'Line Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend'],
  },
};

export const defaultOpts = {
  showLegend: true,
};
