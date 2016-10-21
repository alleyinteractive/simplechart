import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../../../constants';

class Legend extends Component {
  render() {
    return (
      <AccordionBlock
        title="Test 1"
        tooltip="Tooltip content"
        defaultExpand
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Checkbox"
          fieldProps={{
            label: 'Show legend',
            name: 'showLegend',
            checked: this.props.options.showLegend,
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
