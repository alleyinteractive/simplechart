import getSumDomain from '../../utils/dataFormats/getSumDomain';

export const config = {
  type: 'stackedAreaChart',
  label: 'Stacked Area Chart',
  dataFormat: 'britechartsStackedArea',
  componentName: 'Britecharts',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain: getSumDomain,
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
};
