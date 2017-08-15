import React from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

export default function Legend({ options, defaultExpand }) {
  return (
    <AccordionBlock
      title="Legend"
      tooltip="Settings for the chart legend"
      defaultExpand={defaultExpand}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Checkbox"
        fieldProps={{
          label: 'Show legend',
          name: 'showLegend',
          checked: options.showLegend,
        }}
      />

      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Input"
        fieldProps={{
          label: 'Max Key Length',
          name: 'legend.maxKeyLength',
          type: 'number',
          value: getObjArrayKey(options.legend, 'maxKeyLength', 20),
        }}
      />
    </AccordionBlock>
  );
}

Legend.propTypes = {
  options: PropTypes.object.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
};
