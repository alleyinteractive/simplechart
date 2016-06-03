import React, { Component } from 'react';
import { connect } from 'react-redux';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class DiscreteBarChart extends Component {

  constructor() {
    super();
    this.defaultOptions = {
      type: 'discreteBarChart',
      height: 400,
      x: (d) => d.label,
      y: (d) => d.value,
    };
  }

  render() {
    // Merge passed options into defaults
    const args = update(this.defaultOptions, {
      $merge: this.props.options,
    });

    // Add chart data
    args.datum = [{
      key: '',
      values: this.props.data,
    }];

    return (
      <div>
        {React.createElement(NVD3Chart, args)}
      </div>
    );
  }
}

DiscreteBarChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

// Redux connection

export default connect()(DiscreteBarChart);
