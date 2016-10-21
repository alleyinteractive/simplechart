import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class NVD3Single extends Component {
  render() {
    return React.createElement(NVD3Chart, update(
      this.props.options, { $merge: {
        datum: this.props.data,
        ref: 'chart',
      } }
    ));
  }
}

NVD3Single.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

export default NVD3Single;
