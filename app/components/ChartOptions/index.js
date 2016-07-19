import React, { Component } from 'react';
import PalettePicker from '../PalettePicker';

export default class ChartOptions extends Component {
  render() {
    return (
      <PalettePicker
        options={this.props.options}
        data={this.props.data}
      />
    );
  }
}

ChartOptions.propTypes = {
  options: React.PropTypes.object,
  data: React.PropTypes.array,
};
