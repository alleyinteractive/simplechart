import React, { Component } from 'react';
import chartTypeLoader from '../../utils/chartTypeLoader';
import { getChartTypeObject } from '../../constants/chartTypes';

export default class Chart extends Component {

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
    if (nextProps.options.type !== this.props.options.type) {
      this._loadChartType(nextProps.options.type);
    }
  }

  _loadChartType(type) {
    chartTypeLoader(getChartTypeObject(type).componentName)
      .then((component) => {
        this.setState({ chartTypeComponent: component });
      });
  }

  render() {
    if (!this.state.chartTypeComponent) {
      return null;
    }
    return (
      <div>
        {React.createElement(this.state.chartTypeComponent, {
          data: this.props.data,
          options: this.props.options,
          widget: this.props.widget,
        })}
      </div>
    );
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
