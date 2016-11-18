import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import actionTrigger from '../../../../actions';
import { RECEIVE_ERROR } from '../../../../constants';
import { getChartTypeObject } from '../../../../utils/chartTypeUtils';
import { nvd3Defaults } from '../../../../constants/chartTypes';

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

  _buildStateFromProps(props) {
    const nextState = update(props.options, {
      datum: { $set: this._dataTransform(props.options.type, props.data) },
      ref: { $set: 'chartNode' },
    });
    if (!this.props.widget) {
      return nextState;
    }

    // Widgets need to recreate function-based options
    const dataFormat = getChartTypeObject(props.options.type).config.dataFormat;

    // @todo tickFormatSettings -> tick formatting functions
    return update(nextState, { $merge: nvd3Defaults[dataFormat] });
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
    return React.createElement(NVD3Chart, this.state);
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
