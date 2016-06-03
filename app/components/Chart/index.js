import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './ChartTypes/PieChart/';
import DiscreteBarChart from './ChartTypes/DiscreteBarChart/';
import LineChart from './ChartTypes/LineChart/';
import StackedAreaChart from './ChartTypes/StackedAreaChart/';
import InvalidChartType from './ChartTypes/InvalidChartType/';

class Chart extends Component {

  constructor() {
    super();
    this._getChartTypeComponent = this._getChartTypeComponent.bind(this);
  }

  _getChartTypeComponent() {
    switch (this.props.options.type) {
      case 'pieChart':
        return PieChart;

      case 'discreteBarChart':
        return DiscreteBarChart;

      case 'lineChart':
        return LineChart;

      case 'stackedAreaChart':
        return StackedAreaChart;

      default:
        return InvalidChartType;
    }
  }

  render() {
    return (
      <div>
        {React.createElement(
          this._getChartTypeComponent(), this.props
        )}
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection

export default connect()(Chart);
