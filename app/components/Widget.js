import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './Chart';

class Widget extends Component {
  constructor() {
    super();
    this._renderChart = this._renderChart.bind(this);
  }

  _renderChart() {
    if (this.props.data.data[this.props.widget] &&
      this.props.data.data[this.props.widget].options
    ) {
      return (
        <Chart
          data={this.props.data.data[this.props.widget].data}
          options={this.props.data.data[this.props.widget].options}
          metadata={this.props.data.data[this.props.widget].metadata}
        />
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

Widget.propTypes = {
  data: React.PropTypes.object,
  widget: React.PropTypes.string,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(Widget);
