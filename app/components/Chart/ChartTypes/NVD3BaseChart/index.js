import React, { Component } from 'react';
import actionTrigger from '../../../../actions';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_WIDGET_OPTIONS,
} from '../../../../constants';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import createFormatter from '../../../../utils/createFormatter';
import { dataIsMultiSeries } from '../../../../utils/misc';
import { singleXY, multiXY } from '../../../../constants/chartXYFuncs';

class BaseChart extends Component {

  constructor() {
    super();
    this.defaultOptions = {};
    this.defaultsApplied = false;
  }

  componentWillMount() {
    /**
     * Send default options to store before initial render
     */
    const options = update(this.defaultOptions, { $merge: this.props.options });
    if (this._setTickFormat(options, 'xAxis')) {
      options.xAxis = this._setTickFormat(options, 'xAxis');
    }
    if (this._setTickFormat(options, 'yAxis')) {
      options.yAxis = this._setTickFormat(options, 'yAxis');
    }

    if (this.props.widget) {
      if (!options.x) {
        options.x = dataIsMultiSeries(this.props.data) ? multiXY.x : singleXY.x;
      }
      if (!options.y) {
        options.y = dataIsMultiSeries(this.props.data) ? multiXY.y : singleXY.y;
      }
      this.props.dispatch(actionTrigger(RECEIVE_WIDGET_OPTIONS, {
        widget: this.props.widget,
        options,
      }));
    } else {
      this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, options));
    }
    this.defaultsApplied = true;
  }

  /**
   * Delete chart SVG before re-rendering because React might not
   * find diffs that are triggered by chart options changing
   */
  componentWillReceiveProps() {
    if (!this.refs || !this.refs.chart) {
      return;
    }

    // Send yDomain to store if needed
    if (!this.props.options.yDomain) {
      try {
        const yDomain = this.refs.chart.chart.yAxis.domain();
        if (yDomain && yDomain.length === 2) {
          this.props.dispatch(actionTrigger(
            RECEIVE_CHART_OPTIONS, { yDomain }));
        }
      } catch (err) {
        // don't do anything
      }
    }

    const wrapEl = this.refs.chart.refs.root.querySelectorAll('g.nv-wrap');
    if (wrapEl.length) {
      wrapEl[0].parentNode.removeChild(wrapEl[0]);
    }
  }

  /**
   * Create tick formatter function from JSON data
   *
   * @param object options Options object
   * @param string key 'xAxis' or 'yAxis'
   */
  _setTickFormat(options, key) {
    if (options.tickFormatBuilder && options.tickFormatBuilder[key]) {
      return update(options[key] || {}, { $merge: {
        tickFormat: createFormatter(options.tickFormatBuilder[key]),
      } });
    }
    return null;
  }

  render() {
    if (!this.defaultsApplied) {
      return null;
    }

    const datum = this._dataTransformer ?
      this._dataTransformer(this.props.data) : this.props.data;

    return (
      <div>
        {React.createElement(NVD3Chart, update(
          this.props.options, { $merge: { datum, ref: 'chart' } }
        ))}
      </div>
    );
  }
}

BaseChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

export default BaseChart;
