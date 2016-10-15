import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class PieChart extends Component {
  render() {
    return (
      <div>
        {React.createElement(NVD3Chart, update(
          this.props.options, { $merge: {
            datum: this.props.data,
            ref: 'chart',
          } }
        ))}
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

export default PieChart;
