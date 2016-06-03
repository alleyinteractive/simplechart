import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './ChartTypes/PieChart/';
import DiscreteBarChart from './ChartTypes/DiscreteBarChart/';
import LineChart from './ChartTypes/LineChart/';
import StackedAreaChart from './ChartTypes/StackedAreaChart/';

class Chart extends Component {

  constructor() {
    super();
    this._renderChartType = this._renderChartType.bind(this);
  }

  _renderChartType() {
    switch (this.props.options.type) {
      case 'pieChart':
        return (
          <PieChart
            data={this.props.data}
            options={this.props.options}
          />
        );

      case 'discreteBarChart':
        return (
          <DiscreteBarChart
            data={this.props.data}
            options={this.props.options}
          />
        );

      case 'lineChart':
        return (
          <LineChart
            data={this.props.data}
            options={this.props.options}
          />
        );

      case 'stackedAreaChart':
        return React.createElement(StackedAreaChart, this.props);

      default:
        return (
          <span>Unknown chart type: {this.props.options.type}</span>
        );
    }
  }

  render() {
    return (
      <div>
        {this._renderChartType()}
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
