export const config = {
  type: 'discreteBarChart',
  annotations: {
    selector: '.nv-bar rect',
    container: '.nv-barsWrap',
    getCoords: (el) => {
      const transform = d3v4.select(el.node().parentNode)
        .attr('transform').replace(/.*?\((.*?)\)/g, '$1').split(',')
        .map((x) => parseFloat(x, 10));
      const height = parseFloat(el.attr('height'), 10);
      const width = parseFloat(el.attr('width'), 10);

      return {
        x: transform[0] + (width / 2),
        y: transform[1] + (height / 2),
      };
    },
  },
  label: 'Bar Chart',
  dataFormat: 'nvd3SingleSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Metadata', 'ColorPalette', 'Annotations'],
  },
};

export const defaultOpts = {
  showLegend: false,
};

export default {
  config,
  defaultOpts,
};
