import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        onToggle={this.props.onToggle}
        updateExpandOnProps
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
  options: PropTypes.object,
  defaultExpand: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default Legend;
