export const config = {
  type: 'discreteBarChart',
  label: 'Bar Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis'],
  },
};

export const defaultOpts = {
  showLegend: false,
};
