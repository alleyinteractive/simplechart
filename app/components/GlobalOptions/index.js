import React, { Component } from 'react';
import { Input } from 'rebass';

export default class GlobalOptions extends Component {

  componentWillMount() {
    this.setState(this.props.options);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.options);
  }

  render() {
    return (
      <Input
        label="Height"
        name="global-height"
        type="number"
        step="1"
        value={this.state.height}
      />
    );
  }
}

GlobalOptions.propTypes = {
  options: React.PropTypes.object,
};
