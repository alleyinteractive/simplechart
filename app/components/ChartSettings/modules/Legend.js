import React from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';

export default function Legend(props) {
  return (
    <AccordionBlock
      title="Legend"
      tooltip="Settings for the chart legend"
      defaultExpand={props.defaultExpand}
    >
      <DispatchField
        action={RECEIVE_CHART_OPTIONS}
        fieldType="Checkbox"
        fieldProps={{
          label: 'Show legend',
          name: 'showLegend',
          checked: props.options.showLegend,
        }}
      />
    </AccordionBlock>
  );
}

Legend.propTypes = {
  options: PropTypes.object.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
};
