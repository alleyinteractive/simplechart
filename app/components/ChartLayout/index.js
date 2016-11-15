import React, { Component } from 'react';
import { connect } from 'react-redux';
// import {
//   RECEIVE_CHART_OPTIONS,
// } from '../../constants';
// import actionTrigger from '../../actions';
import AccordionBlock from '../Layout/AccordionBlock';
import DispatchField from '../lib/DispatchField';

class ChartLayout extends Component {

  _getChartWidth() {
    return 350;
  }

  _getChartHeight() {
    return 400;
  }

  _handleChange(fieldProps, newValue) {
    console.log(fieldProps, newValue);
    return;
  }

  render() {
    return (
      <div>
        <AccordionBlock
          title="Breakpoint 1"
          tooltip="Set max width and height for Breakpoint 1"
          defaultExpand
        >
          <DispatchField
            action="DUMMY_ACTION"
            fieldType="Input"
            fieldProps={{
              label: 'Max width',
              name: '1.maxWidth',
              value: this._getChartWidth(1),
              type: 'number',
              step: 1,
              min: 350,
            }}
            handler={this._handleChange}
          />
          <DispatchField
            action="DUMMY_ACTION"
            fieldType="Input"
            fieldProps={{
              label: 'Height',
              name: '1.height',
              value: this._getChartHeight(1),
              type: 'number',
              step: 1,
              min: 100,
            }}
            handler={this._handleChange}
          />
        </AccordionBlock>
      </div>
    );
  }
}

ChartLayout.propTypes = {
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartLayout);
