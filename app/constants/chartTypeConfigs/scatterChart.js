export const config = {
  type: 'scatterChart',
  label: 'Scatter Chart',
  dataFormat: 'nvd3ScatterMultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  showLegend: true,
};
