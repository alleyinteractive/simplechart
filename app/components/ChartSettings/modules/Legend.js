import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';

class Legend extends Component {
  render() {
    return (
      <AccordionBlock
        title="Legend"
        tooltip="Settings for the chart legend"
        defaultExpand={this.props.defaultExpand}
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
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
  defaultExpand: React.PropTypes.bool,
};

export default Legend;
