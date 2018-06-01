// Taken From:
// https://github.com/NuCivic/react-nvd3
// Brought into repo due to small size and needing to fix linechart renderEnd bug
// Source was paired down and tailored to Simplechart's needs.

import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import nv from 'nvd3';
import {
  pick,
  without,
  isPlainObject,
} from './utils.js';

const SETTINGS = ['x', 'y', 'type', 'datum', 'configure'];
const SIZE = ['width', 'height'];
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
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
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
    return (predicate || pick)(this.props, keys);
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

    if ('pieChart' === this.props.type) {
      dispatcher = this.chart.pie.dispatch;
    } else {
      dispatcher = this.chart.dispatch;
    }

    if (dispatcher.renderEnd) {
      dispatcher.on('renderEnd', this.renderEnd.bind(this));
    }

    this.props.renderStart(this.chart, RENDER_START);

    if (this.chart.x) {
      this.chart.x(this.props.x);
    }

    if (this.chart.y) {
      this.chart.y(this.props.y);
    }

    // Configure componentes recursively
    this.configureComponents(
      this.chart,
      this.options(SETTINGS.concat(CONTAINER_STYLE), without)
    );

    // hook for configuring the chart
    this.props.configure(this.chart);

    // Render chart using d3
    this.selection = d3.select(this.svg)
      .datum(this.props.datum)
      .call(this.chart);

      // Update the chart if the window size change.
      // Save resizeHandle to remove the resize listener later.
    if (!this.resizeHandler) {
      this.resizeHandler = nv.utils.windowResize(this.chart.update);
    }

    this.rendering = true;

    return this.chart;
  }

  /**
   * Render function
   * svg element needs to have height and width.
   */
  render() {
    const size = pick(this.props, SIZE);
    return (
      <div className="nv-chart">
        <svg ref={(svg) => { this.svg = svg; }} {...size} />
      </div>
    );
  }
}
