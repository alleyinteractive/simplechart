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
          type: this.state.type,
          height: this.state.height,
          x: (d) => d[0],
          y: (d) => d[1],
          datum: this.state.datum,
          margin: {
            bottom: 150,
            left: 150,
          },
          legend: {
            padding: 27,
          },
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
