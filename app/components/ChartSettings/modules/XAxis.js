import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

class XAxis extends Component {

  _getOptsKey(axisOpts, key, defaultValue = '') {
    return axisOpts && axisOpts[key] ? axisOpts[key] : defaultValue;
  }

  render() {
    return (
      <AccordionBlock
        title="X Axis"
        tooltip="Settings for the X axis"
        defaultExpand={this.props.defaultExpand}
        toggleCallback={this.props.toggleCallback}
        updateExpandOnProps
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Axis Label',
            name: 'xAxis.axisLabel',
            value: getObjArrayKey(this.props.options.xAxis, 'axisLabel'),
          }}
        />

        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Rotate Labels (degrees +/-)',
            name: 'xAxis.rotateLabels',
            type: 'number',
            value: getObjArrayKey(this.props.options.xAxis, 'rotateLabels'),
          }}
        />
      </AccordionBlock>
    );
  }
}

XAxis.propTypes = {
  options: PropTypes.object,
  defaultExpand: PropTypes.bool,
  toggleCallback: PropTypes.func,
};

export default XAxis;
