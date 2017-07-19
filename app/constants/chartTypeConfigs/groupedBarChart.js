export const config = {
  type: 'groupedBarChart',
  label: 'Grouped Bar Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
  stacked: false,
  staggerLabels: true,
};

export default {
  config,
  defaultOpts,
};
