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
        title="X Axis"
        tooltip="Settings for the X axis"
        defaultExpand
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS_EXTEND}
          fieldType="Input"
          fieldProps={{
            label: 'Label',
            name: 'xAxis.axisLabel',
            type: 'number',
            step: '1',
            value: this.props.options.xAxis.axisLabel,
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
