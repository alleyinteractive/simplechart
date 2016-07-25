import React from 'react';
import BaseChartOptions from '../NVD3BaseChart/BaseChartOptions';
import { connect } from 'react-redux';
import { Input } from 'rebass';

class Options extends BaseChartOptions {
  render() {
    return (
      <fieldset>
        <Input
          label="Height"
          name="props-height"
          type="number"
          step="1"
          value={this.props.options.height}
          onChange={this._handleChange}
        />
        {this.renderChildFields()}
      </fieldset>
    );
  }

}

Options.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(Options);
