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

/**
 * Defines size of points for scatter chart
 */
const scatterChartPointRange = [60, 60];

/**
 * Similar to default opts but dependent on state at the time when
 * the RECEIVE_CHART_TYPE action is fired. This example only uses
 * transformedData but others might rely on other parts of the state.
 *
 * @param {Object} state Redux application state.
 * @return {Object} Object to merge into chart options, may be empty
 */
export const conditionalOpts = ({ transformedData }) => {
  if (!scatterDataHasSizes(transformedData.nvd3ScatterMultiSeries)) {
    // `pointRange` determines the size of points in scatter charts
    return { pointRange: scatterChartPointRange };
  }
  // Do nothing for bubble charts
  return {};
};

export default {
  config,
  defaultOpts,
  conditionalOpts,
};
