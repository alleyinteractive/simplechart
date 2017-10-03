/**
 * Simplechart version of NVD3's multiBarChart w/ { stacked: false }
 */
export const config = {
  type: 'groupedBarChart',
  label: 'Grouped Bar Chart',
  dataFormat: 'nvd3BarMultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
  stacked: false,
  reduceXTicks: false,
};

export default {
  config,
  defaultOpts,
};
