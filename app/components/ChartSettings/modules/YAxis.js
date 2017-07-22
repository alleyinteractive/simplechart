import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccordionBlock from '../../Layout/AccordionBlock';
import DispatchField from '../../lib/DispatchField';
import {
  RECEIVE_CHART_OPTIONS,
} from '../../../constants';
import { getObjArrayKey } from '../../../utils/misc';

export default class YAxis extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    defaultExpand: PropTypes.bool.isRequired,
  };

  handleYDomain = (fieldProps, value) => {
    let domain = this.props.options.yDomain || [];
    if ('yDomain.min' === fieldProps.name) {
      domain[0] = value;
    } else if (0 === domain.length) {
      domain = [0, value];
    } else {
      domain[1] = value;
    }
    return { yDomain: domain };
  };

  render() {
    return (
      <AccordionBlock
        title="Y Axis"
        defaultExpand={this.props.defaultExpand}
      >
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Axis Label',
            name: 'yAxis.axisLabel',
            value: getObjArrayKey(this.props.options.yAxis, 'axisLabel'),
          }}
        />
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Minimum value',
            name: 'yDomain.min',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(this.props.options.yDomain, 0),
          }}
          handler={this.handleYDomain}
        />
        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Maximum value',
            name: 'yDomain.max',
            type: 'number',
            step: 'any',
            value: getObjArrayKey(this.props.options.yDomain, 1),
          }}
          handler={this.handleYDomain}
        />

        <DispatchField
          action={RECEIVE_CHART_OPTIONS}
          fieldType="Input"
          fieldProps={{
            label: 'Width',
            name: 'margin.left',
            type: 'number',
            value: getObjArrayKey(this.props.options.margin, 'left', 50),
          }}
        />
      </AccordionBlock>
    );
  }
}
