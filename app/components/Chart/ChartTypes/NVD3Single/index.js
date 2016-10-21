import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class NVD3Single extends Component {
  componentWillMount() {
    this.setState({
      data: this._chartTypeTransform(this.props.data),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: this._chartTypeTransform(nextProps.data),
    });
  }

  _chartTypeTransform(chartType, data) {
    switch (chartType) {
      case 'discreteBarChart':
        return [{
          key: '',
          values: data,
        }];

      default:
        return data;
    }
  }

  render() {
    return React.createElement(NVD3Chart, update(
      this.props.options, { $merge: {
        datum: this.state.data,
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
