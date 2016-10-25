import React, { Component } from 'react';
import chartTypeLoader from '../../utils/chartTypeLoader';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import update from 'react-addons-update';

class Chart extends Component {

  constructor() {
    super();
    this._loadChartType = this._loadChartType.bind(this);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.options.type) {
      this._loadChartType(this.props.options.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this._getComponentName(nextProps) !== this._getComponentName(this.props)) { // eslint-disable-line max-len
      this._loadChartType(nextProps.options.type);
    }
  }

  _getComponentName(props) {
    return getChartTypeObject(props.options.type).config.componentName;
  }

  _loadChartType(type) {
    chartTypeLoader(getChartTypeObject(type).config.componentName)
      .then((component) => {
        this.setState({ chartTypeComponent: component });
      });
  }

  render() {
    return !this.state.chartTypeComponent ?
      null :
      React.createElement(this.state.chartTypeComponent,
        update(this.props, { $merge: { ref: 'chartTypeComponent' } }));
  }
}

Chart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

export default Chart;
