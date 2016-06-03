import React, { Component } from 'react';
import { connect } from 'react-redux';

class InvalidChartType extends Component {

  render() {
    return (
      <p>Unknown chart type: {this.props.options.type}</p>
    );
  }
}

InvalidChartType.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

// Redux connection

export default connect()(InvalidChartType);
