import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../../Layout/AccordionBlock';
import DispatchField from '../../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../../constants';

export default class Legend extends Component {
  render() {
    return (
      <AccordionBlock
        title="Pie Chart Settings"
        tooltip="Specific settings for pie charts"
        defaultExpand={this.props.defaultExpand}
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
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
  options: PropTypes.object,
  defaultExpand: PropTypes.bool,
};
