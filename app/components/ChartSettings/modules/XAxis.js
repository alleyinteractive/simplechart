import React from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

export default function XAxis(props) {
  return (
    <AccordionBlock
      title="X Axis"
      tooltip="Settings for the X axis"
      defaultExpand={props.defaultExpand}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Axis Label',
          name: 'xAxis.axisLabel',
          value: getObjArrayKey(props.options.xAxis, 'axisLabel'),
        }}
      />

      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Rotate Labels (degrees +/-)',
          name: 'xAxis.rotateLabels',
          type: 'number',
          value: getObjArrayKey(props.options.xAxis, 'rotateLabels'),
        }}
      />
    </AccordionBlock>
  );
}

XAxis.propTypes = {
  options: PropTypes.object.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
};
