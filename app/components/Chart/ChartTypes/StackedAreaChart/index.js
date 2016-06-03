import React, { Component } from 'react';
import { connect } from 'react-redux';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class StackedAreaChart extends Component {

  constructor() {
    super();
    this.defaultOptions = {
      type: 'stackedAreaChart',
      height: 400,
      useInteractiveGuidline: true,
    };
  }

  componentWillMount() {
    this.setState({ data: this.props.data });
  }

  render() {
    // Merge passed options into defaults
    const args = update(this.defaultOptions, {
      $merge: this.props.options,
    });

    // Add chart data
    args.datum = this.state.data;

    return (
      <div>
        {React.createElement(NVD3Chart, args)}
      </div>
    );
  }
}

StackedAreaChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

// Redux connection

export default connect()(StackedAreaChart);
