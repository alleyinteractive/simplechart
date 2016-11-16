import React, { Component } from 'react';
import { connect } from 'react-redux';
// import {
//   RECEIVE_CHART_OPTIONS,
// } from '../../constants';
// import actionTrigger from '../../actions';
import AccordionBlock from '../Layout/AccordionBlock';
import DispatchField from '../lib/DispatchField';
import { Button } from 'rebass';
import update from 'react-addons-update';

class ChartLayout extends Component {
  constructor() {
    super();
    this._renderBreakpoint = this._renderBreakpoint.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._addBreakpoint = this._addBreakpoint.bind(this);
    this._removeBreakpoint = this._removeBreakpoint.bind(this);

    this.state = {
      active: 0,
      values: [],
    };
  }

  componentWillMount() {
    // Set up a default breakpoint with current height
    this.defaultBreakpoint = {
      noMaxWidth: true,
      maxWidth: 350,
      height: this.props.options.height,
    };

    if (this.props.options.breakpoints) {
      this.setState(this.props.options.breakpoints);
    } else {
      this.setState({ values: [this.defaultBreakpoint] });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.breakpoints) {
      this.setState(nextProps.options.breakpoints);
    }
  }

  _handleChange(fieldProps, newValue) {
    // break field name into index and key
    const fieldNameParts = fieldProps.name.split('.');
    this.setState({ values: update(this.state.values, {
      [fieldNameParts[0]]: {
        $merge: { [fieldNameParts[1]]: newValue },
      },
    }) });
  }

  _removeBreakpoint(evt) {
    const idx = parseInt(evt.target.getAttribute('data-index'), 10);
    if (isNaN(idx)) {
      return;
    }
    this.setState({ values: update(this.state.values, {
      $splice: [[idx, 1]],
    }) });
  }

  _renderBreakpoint(point, idx) {
    const pointTitle = `Breakpoint ${1 + idx}`;
    return (
      <AccordionBlock
        title={pointTitle}
        tooltip={`Set max width and height for ${pointTitle}`}
        key={`breakpoint.${idx}`}
      >
        <DispatchField
          fieldType="Checkbox"
          fieldProps={{
            label: 'No max width',
            name: `${idx}.noMaxWidth`,
            checked: point.noMaxWidth,
          }}
          handler={this._handleChange}
        />
        {point.noMaxWidth ? '' : (
          <DispatchField
            fieldType="Input"
            fieldProps={{
              label: 'Max width',
              name: `${idx}.maxWidth`,
              value: point.maxWidth,
              disabled: point.noMaxWidth,
              type: 'number',
              step: 1,
              min: 350,
            }}
            handler={this._handleChange}
          />
        )}
        <DispatchField
          fieldType="Input"
          fieldProps={{
            label: 'Height',
            name: `${idx}.height`,
            value: point.height,
            type: 'number',
            step: 1,
            min: 100,
          }}
          handler={this._handleChange}
        />
        {1 >= this.state.values.length ? '' : (
          <Button
            theme="error"
            data-index={idx}
            onClick={this._removeBreakpoint}
          >Remove</Button>
        )}
      </AccordionBlock>
    );
  }

  _addBreakpoint() {
    this.setState({ values: update(this.state.values, {
      $push: [this.defaultBreakpoint],
    }) });
  }

  render() {
    return (
      <div>
        {this.state.values.map(this._renderBreakpoint)}
        <Button
          theme="success"
          big
          onClick={this._addBreakpoint}
        >Add Breakpoint</Button>
      </div>
    );
  }
}

ChartLayout.propTypes = {
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartLayout);
