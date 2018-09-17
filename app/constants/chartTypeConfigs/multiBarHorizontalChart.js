export const config = {
  type: 'multiBarHorizontalChart',
  label: 'Horizontal Multiple Bar Chart',
  dataFormat: 'nvd3BarMultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['MultibarSettings', 'XAxis', 'YAxis', 'Metadata', 'ColorPalette', 'Annotations'],
  },
};

export const defaultOpts = {
  stacked: false,
  showControls: false,
  showLegend: true,
  showValues: true,
  reduceXTicks: false,
  annotations: {
    selector: '.nv-bar rect',
    container: '.nv-barsWrap',
    getCoords: function getCoords({ data }, selector) {
      const el = d3v4.selectAll(selector)
        .filter((itemData, index) =>
          (index === data.index ? itemData : false)
        );
      if (!el.node()) {
        return { x: 0, y: 0 };
      }
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
};

export default {
  config,
  defaultOpts,
};
