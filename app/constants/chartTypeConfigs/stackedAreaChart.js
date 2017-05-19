import { max } from 'd3';

export const config = {
  type: 'stackedAreaChart',
  label: 'Stacked Area Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain(datum) {
    const sumMaxY = (acc, { values }) => acc + max(values.map(({ y }) => y));
    return [0, datum.reduce(sumMaxY, 0)];
  },
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
};
