import React, { Component } from 'react';
import AccordionBlock from '../../Layout/AccordionBlock';

export default class Legend extends Component {
  render() {
    return (
      <AccordionBlock
        title="Test 1"
        tooltip="Tooltip content"
        defaultExpand
      >
        <p>a group of fields like "X-Axis Settings" would go here"</p>
      </AccordionBlock>
    );
  }
}
