import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actionTrigger from '../../../../actions';
import { RECEIVE_ERROR } from '../../../../constants';

class NVD3Single extends Component {

  componentWillReceiveProps(nextProps) {
    // If chart type changes, remove obsolete charts after render
    this.setState({
      cleanupNVD3Render: false,
      nextType: nextProps.options.type,
    });
  }

  componentDidUpdate() {
    if (this.state.cleanupNVD3Render) {
      this._cleanupNVD3Render(this.state.nextType, this.refs.chartNode);
    }
  }

  /**
   * We may need to manually remove old rendered charts when chart type changes
   * from div.nv-chart > svg > g.nv-{prevChartType}
   *
   * @param string nextType Newly rendered chart type
   * @param node refNode DOM node where chart are rendered
   */
  _cleanupNVD3Render(nextType, refNode) {
    try {
      const chartNode = ReactDOM.findDOMNode(refNode);
      chartNode.querySelectorAll('svg > g').forEach((typeEl) => {
        // className is SVGAnimatedString so we check its baseVal
        if (-1 === typeEl.className.baseVal.indexOf(`nv-${nextType}`)) {
          chartNode.firstElementChild.removeChild(typeEl);
        }
      });
    } catch (e) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e004'));
    }
  }

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
        datum: this._dataTransform(this.props.options.type, this.props.data),
        ref: 'chartNode',
      } }
    ));
  }
}

NVD3Single.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(NVD3Single);
