/**
 * This chart type is not surfaced in the UI. The mutliBarChart chart type in NVD3
 * encompasses what Simplechart separates into groupedBarChart and stackedBarChart
 * groupedBarChart = multiBarChart w/ { stacked: false }
 * stackedBarChart = multiBarChart w/ { stacked: true }
 */
export const config = {
  type: 'multiBarChart',
  label: 'Multiple Bar Chart',
  dataFormat: 'nvd3BarMultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain: getSumDomain,
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
};

export default {
  config,
  defaultOpts,
};
