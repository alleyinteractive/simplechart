/* eslint max-len:0 */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NVD3Chart from 'react-nvd3';

class Chart extends Component {

  render() {
    return (
      <div>
      {
        React.createElement(NVD3Chart, {
          type: this.props.data.options.type,
          height: this.props.data.options.height,
          x: (d) => d.label,
          y: (d) => d.value,
          showLegend: false,
          showLabels: false,
          datum: this.props.data.data,
        })
      }
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection

export default connect()(Chart);
