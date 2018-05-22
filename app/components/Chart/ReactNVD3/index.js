import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import nv from 'nvd3';
import {
  pick,
  without,
  isPlainObject,
  bindFunctions,
  getValueFunction,
  propsByPrefix,
} from './utils.js';

const SETTINGS = ['x', 'y', 'type', 'datum', 'configure'];
const SIZE = ['width', 'height'];
const MARGIN = 'margin';
const CONTAINER_STYLE = 'containerStyle';

const RENDER_START = 'renderStart';
const RENDER_END = 'renderEnd';
const READY = 'ready';

export default class NVD3Chart extends React.Component {
  static defaultProps = {
    ready: () => {},
    renderStart: () => {},
    renderEnd: () => {},
    configure: () => {},
  }
  static propTypes = {
    type: PropTypes.string.isRequired,
    configure: PropTypes.func,
    ready: PropTypes.func,
    renderStart: PropTypes.func,
    renderEnd: PropTypes.func,
    datum: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    })).isRequired,
  };

  /**
   * Instantiate a new chart setting
   * a callback if exists
   */
  componentDidMount() {
    nv.addGraph(this.renderChart.bind(this), (chart) =>
      this.props.ready(chart, READY)
    );
  }

  /**
   * Update the chart after state is changed.
   */
  componentDidUpdate() {
    this.renderChart();
  }

  /**
   * Remove listeners
   */
  componentWillUnmount() {
    if (this.resizeHandler) {
      this.resizeHandler.clear();
    }
  }

  /**
   * Configure components recursively
   * @param {nvd3 chart} chart  A nvd3 chart instance
   * @param {object} options    A key value object
   */
  configureComponents(chart, options) {
    Object.keys(options).forEach((optionName) => {
      const optionValue = options[optionName];
      if (chart) {
        if (isPlainObject(optionValue)) {
          this.configureComponents(chart[optionName], optionValue);
        } else if ('function' === typeof chart[optionName]) {
          chart[optionName](optionValue);
        }
      }
    });
  }

  /**
   * Filter options base on predicates
   * @param {Array} keys          An array of keys to preserve or remove
   * @param {Function} predicate  The function used to filter keys
   */
  options(keys, predicate) {
    // DEPRECATED: this.props.chartOptions
    const opt = this.parsedProps.options ||
      this.parsedProps || this.props.chartOptions;
    predicate = predicate || pick;
    return predicate(opt, keys);
  }

  /**
   * Render end callback function
   */
  renderEnd() {
    this.props.renderEnd(this.chart, RENDER_END);

    // Once renders end then we set rendering to false to allow to reuse the chart instance.
    this.rendering = false;
  }

  /**
   * Creates a chart model and render it
   */
  renderChart() {
    let dispatcher;

    // We try to reuse the current chart instance. If not possible then lets instantiate again
    this.chart = (this.chart && !this.rendering) ?
      this.chart : nv.models[this.props.type]();

    this.props.renderStart(this.chart, RENDER_START);

    this.parsedProps = bindFunctions(this.props, this.props.context);

    if (this.chart.x) {
      this.chart.x(getValueFunction(this.parsedProps.x, 'x'));
    }

    if (this.chart.y) {
      this.chart.y(getValueFunction(this.parsedProps.y, 'y'));
    }

    if (this.chart.margin) {
      this.chart.margin(this.options(MARGIN, pick).margin || propsByPrefix('margin', this.props) || {});
    }

    // Configure componentes recursively
    this.configureComponents(
      this.chart,
      this.options(SETTINGS.concat(CONTAINER_STYLE), without)
    );

    // hook for configuring the chart
    this.props.configure(this.chart);

    // Render chart using d3
    this.selection = d3.select(this.refs.svg)
      .datum(this.props.datum)
      .call(this.chart);

      // Update the chart if the window size change.
      // Save resizeHandle to remove the resize listener later.
    if (!this.resizeHandler) {
      this.resizeHandler = nv.utils.windowResize(this.chart.update);
    }

    // PieCharts and lineCharts are an special case. Their dispacher is the pie component inside the chart.
    // There are some charts do not feature the renderEnd event
    switch (this.props.type) {
      case 'pieChart':
        dispatcher = this.chart.pie.dispatch;
        break;
      case 'lineChart':
        dispatcher = this.chart.lines.dispatch;
        break;
      default:
        dispatcher = this.chart.dispatch;
    }

    dispatcher.renderEnd && dispatcher.on('renderEnd', this.renderEnd.bind(this));
    this.rendering = true;

    return this.chart;
  }

  /**
   * Render function
   * svg element needs to have height and width.
   */
  render() {
    const size = pick(this.props, SIZE);
    const style = Object.assign({}, size, this.props.containerStyle);
    return (
      <div ref="root" className="nv-chart" style={style} >
        <svg ref="svg" {...size} />
      </div>
    );
  }
}
