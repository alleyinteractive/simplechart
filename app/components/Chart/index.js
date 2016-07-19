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
    // if no type has been chosen yet
    if (!this.props.options.type) {
      return '';
    }

    let chartType;
    switch (this.props.options.type) {
      case 'pieChart':
        chartType = PieChart;
        break;

      case 'discreteBarChart':
        chartType = DiscreteBarChart;
        break;

      case 'lineChart':
        chartType = LineChart;
        break;

      case 'stackedAreaChart':
        chartType = StackedAreaChart;
        break;

      default:
        chartType = InvalidChartType;
    }
    return React.createElement(chartType, this.props);
  }

  render() {
    return (
      <div>
        <h3>{this.props.metadata.title}</h3>
        {this._getChartTypeComponent()}
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
