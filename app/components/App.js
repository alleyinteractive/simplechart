import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './Chart';
import '../css/base.css';

class App extends Component {
  constructor() {
    super();
    this._renderChart = this._renderChart.bind(this);
  }

  _renderChart() {
    if (this.props.data.data[this.props.widget] &&
      this.props.data.data[this.props.widget].options
    ) {
      return (
        <Chart data={this.props.data.data[this.props.widget]} />
      );
    }
    return (
      <span>waiting for data</span>
    );
  }

  render() {
    return (
      <div>
        {this._renderChart()}
      </div>
    );
  }
}

App.propTypes = {
  data: React.PropTypes.object,
  widget: React.PropTypes.string,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(App);
