import React, { Component } from 'react';
import AccordionBlock from '../../../Layout/AccordionBlock';
import DispatchField from '../../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../../../../constants';

class Legend extends Component {
  render() {
    return (
      <AccordionBlock
        title="Pie Chart Settings"
        tooltip="Specific settings for pie charts"
        defaultExpand
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Checkbox"
          fieldProps={{
            label: 'Donut',
            name: 'donut',
            checked: this.props.options.donut,
          }}
        />
      </AccordionBlock>
    );
  }
}

Legend.propTypes = {
  options: React.PropTypes.object,
};

export default Legend;
