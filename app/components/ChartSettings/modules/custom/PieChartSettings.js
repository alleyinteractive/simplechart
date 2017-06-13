import React from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../../Layout/AccordionBlock';
import DispatchField from '../../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../../constants';

export default function Legend(props) {
  return (
    <AccordionBlock
      title="Pie Chart Settings"
      tooltip="Specific settings for pie charts"
      defaultExpand={props.defaultExpand}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Checkbox"
        fieldProps={{
          label: 'Donut',
          name: 'donut',
          checked: props.options.donut,
        }}
      />
    </AccordionBlock>
  );
}

Legend.propTypes = {
  options: PropTypes.object.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
};
