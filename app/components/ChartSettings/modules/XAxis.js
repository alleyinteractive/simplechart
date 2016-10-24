import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../../../constants';

class XAxis extends Component {

  _getOptsKey(axisOpts, key, defaultValue = '') {
    return axisOpts && axisOpts[key] ? axisOpts[key] : defaultValue;
  }

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
            value: this._getOptsKey(this.props.options.xAxis, 'axisLabel'),
          }}
        />
      </AccordionBlock>
    );
  }
}

XAxis.propTypes = {
  options: React.PropTypes.object,
};

export default XAxis;
