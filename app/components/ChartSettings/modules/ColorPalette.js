import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import PalettePicker from '../../lib/PalettePicker';

class ColorPalette extends Component {

  _getOptsKey(axisOpts, key, defaultValue = '') {
    return axisOpts && axisOpts[key] ? axisOpts[key] : defaultValue;
  }

  render() {
    return (
      <AccordionBlock
        title="Color palette"
        tooltip="Set data series colors"
        defaultExpand={this.props.defaultExpand}
      >
        <PalettePicker
          options={this.props.options}
          data={this.props.data}
        />
      </AccordionBlock>
    );
  }
}

ColorPalette.propTypes = {
  options: React.PropTypes.object,
  data: React.PropTypes.array,
  defaultExpand: React.PropTypes.bool,
};

export default ColorPalette;
