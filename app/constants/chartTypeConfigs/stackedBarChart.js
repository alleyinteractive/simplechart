import getSumDomain from '../../utils/dataFormats/getSumDomain';

export const config = {
  type: 'stackedBarChart',
  label: 'Stacked Bar Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain: getSumDomain,
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
  stacked: true,
  reduceXTicks: false,
};

export default {
  config,
  defaultOpts,
};
