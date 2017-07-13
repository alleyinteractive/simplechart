import React from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import PalettePicker from '../../lib/PalettePicker';

export default function ColorPalette(props) {
  return (
    <AccordionBlock
      title="Color palette"
      tooltip="Set data series colors"
      defaultExpand={props.defaultExpand}
    >
      <PalettePicker
        palette={props.options.color || []}
        data={props.data}
      />
    </AccordionBlock>
  );
}

ColorPalette.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
};
