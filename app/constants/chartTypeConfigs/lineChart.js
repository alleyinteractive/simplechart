import * as d3v4 from '../../vendor/d3v4';

export const config = {
  type: 'lineChart',
  label: 'Line Chart',
  dataFormat: 'nvd3MultiSeries',
  componentName: 'NVD3Adapter',
  modules: {
    settings: ['XAxis', 'YAxis', 'Legend', 'Metadata', 'ColorPalette', 'Annotations'],
  },
};

export const defaultOpts = {
  duration: 0,
  interactiveUpdateDelay: 0,
  showLegend: true,
  annotations: {
    selector: '.nv-point-paths path',
    container: '.nv-linesWrap',
    getCoords: function getCoords(annotationWithChartData, selector) {
      const { data } = annotationWithChartData;
      const allPaths = d3v4.selectAll(selector);

      if (!allPaths.nodes().length) {
        return { x: 0, y: 0 };
      }

      const clipPathAttr = allPaths
        .filter(({ series, point }) =>
          data.series === series && data.point === point)
        .attr('clip-path')
        .replace(/url\((.*?)\)/ig, '$1');
      const circle = d3v4.select(`${clipPathAttr} circle`);
      return {
        x: circle.attr('cx'),
        y: circle.attr('cy'),
      };
    },
  },
};

export default {
  config,
  defaultOpts,
};
