import {
  scatterDataHasSizes,
} from '../../utils/dataFormats/nvd3ScatterMultiSeries';
export const config = {
  type: 'scatterChart',
  label: ({ nvd3ScatterMultiSeries }) => {
    const data = nvd3ScatterMultiSeries;
    return data && scatterDataHasSizes(data) ? 'Bubble Chart' : 'Scatter Chart';
  },
  dataFormat: 'nvd3ScatterMultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette'],
  },
};

export const defaultOpts = {
  showLegend: true,
};
