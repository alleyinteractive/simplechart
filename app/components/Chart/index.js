import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './ChartTypes/PieChart/';
import DiscreteBarChart from './ChartTypes/DiscreteBarChart/';
import LineChart from './ChartTypes/LineChart/';
import StackedAreaChart from './ChartTypes/StackedAreaChart/';
import InvalidChartType from './ChartTypes/InvalidChartType/';
import * as styles from './Chart.css';

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
        <h3>{this.props.metadata.title}</h3>
        {React.createElement(
          this._getChartTypeComponent(), this.props
        )}
        <p>{this.props.metadata.caption}</p>

        {this.props.metadata.credit ?
          (<p className={styles.credit}>
            Credit: {this.props.metadata.credit}
          </p>) :
          ''
        }
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  metadata: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection

export default connect()(Chart);
