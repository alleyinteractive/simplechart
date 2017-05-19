import { max } from 'd3';

export const config = {
  type: 'stackedAreaChart',
  label: 'Stacked Area Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain(data) {
    const mapDatumToY = (datum) => datum.values.map((series) => series.y);
    const addMaxY = (acc, datum) => acc + max(mapDatumToY(datum));
    const yValuesSummed = data.reduce(addMaxY, 0);
    return [0, yValuesSummed];
  },
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
};
