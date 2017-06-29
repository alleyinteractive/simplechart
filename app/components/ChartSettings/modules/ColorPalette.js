import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        onToggle={this.props.onToggle}
        updateExpandOnProps
      >
        <PalettePicker
          palette={this.props.options.color || []}
          data={this.props.data}
        />
      </AccordionBlock>
    );
  }
}

ColorPalette.propTypes = {
  options: PropTypes.object,
  data: PropTypes.array,
  defaultExpand: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ColorPalette;
