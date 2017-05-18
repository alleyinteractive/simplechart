import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import actionTrigger from '../../../../actions';
import { RECEIVE_ERROR } from '../../../../constants';
import { getChartTypeObject } from '../../../../utils/chartTypeUtils';
import { nvd3Defaults } from '../../../../constants/chartTypes';
import applyTickFormatters from '../../../../middleware/utils/applyTickFormatters';
import { shouldSetupYDomain } from '../../../../middleware/utils/applyYDomain';
import getNiceDomain from '../../../../utils/dataFormats/getNiceDomain';

class NVD3Adapter extends Component {

  componentWillMount() {
    this.setState(this._buildStateFromProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._buildStateFromProps(nextProps));

    try {
      // Force the react-nvd3 to re-render the chart, when new props are received
      this.refs.chartNode.rendering = true;
      const wrapEl = this.refs.chartNode.refs.root.querySelector('g.nv-wrap');
      if (wrapEl) {
        wrapEl.parentNode.removeChild(wrapEl);
      }
    } catch (err) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e004'));
      console.log(err.message); // eslint-disable-line no-console
    }
  }

  /**
   * In editor, merge data into options and add a ref
   * In widget, also recreate function-based options that can't be sent as JSON
   */
  _buildStateFromProps(props) {
    let nextState = update(props.options, {
      datum: { $set: this._dataTransform(props.options.type, props.data) },
      ref: { $set: 'chartNode' },
    });

    /**
     * @todo Make this part of chart type's config
     */
    if ('stackedAreaChart' === nextState.type && nextState.yDomain) {
      delete nextState.yDomain;
    }

    if (!this.props.widget) {
      return nextState;
    }

    // Widgets need to recreate function-based options
    const typeConfig = getChartTypeObject(props.options.type).config;

    nextState = update(nextState, {
      x: { $set: nvd3Defaults[typeConfig.dataFormat].x },
      y: { $set: nvd3Defaults[typeConfig.dataFormat].y },
      yDomain: { $apply: (oldYDomain) => { // eslint-disable-line arrow-body-style
        return (shouldSetupYDomain(typeConfig) && undefined === oldYDomain) ?
          getNiceDomain(typeConfig.dataFormat, props.data) : oldYDomain;
      } },
    });

    // tickFormatSettings -> tick formatting functions
    // applyTickFormatters() returns a cloned object
    return applyTickFormatters(nextState, typeConfig);
  }

  /**
   * Apply any special formatting specfic to a chart type
   */
  _dataTransform(chartType, data) {
    switch (chartType) {
      case 'discreteBarChart':
        return [{
          key: '',
          values: data,
        }];

      default:
        return data;
    }
  }

  render() {
    return React.createElement(NVD3Chart, cloneDeep(this.state));
  }
}

NVD3Adapter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
  dispatch: React.PropTypes.func,
};

export default connect()(NVD3Adapter);
