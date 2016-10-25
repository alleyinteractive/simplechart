import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import actionTrigger from '../../../../actions';
import { RECEIVE_ERROR } from '../../../../constants';

class NVD3Adapter extends Component {

  componentWillMount() {
    this.setState({
      datum: this._dataTransform(this.props.options.type, this.props.data),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      datum: this._dataTransform(nextProps.options.type, nextProps.data),
    });

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
    return React.createElement(NVD3Chart, update(
      this.props.options, { $merge: {
        datum: this.state.datum,
        ref: 'chartNode',
      } }
    ));
  }
}

NVD3Adapter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(NVD3Adapter);
