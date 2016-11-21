import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RECEIVE_ERROR,
  RECEIVE_CHART_OPTIONS_EXTEND,
} from '../../constants';
import actionTrigger from '../../actions';
import AccordionBlock from '../Layout/AccordionBlock';
import DispatchField from '../lib/DispatchField';
import { Button } from 'rebass';
import update from 'react-addons-update';
import { defaultBreakpoint } from '../../constants/chartTypes';

class ChartLayout extends Component {
  constructor() {
    super();
    this._renderBreakpoint = this._renderBreakpoint.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._addBreakpoint = this._addBreakpoint.bind(this);
    this._removeBreakpoint = this._removeBreakpoint.bind(this);
    this._dispatchValues = this._dispatchValues.bind(this);
    this._updateActiveBreakpoint = this._updateActiveBreakpoint.bind(this);
    this._isSingleBp = this._isSingleBp.bind(this);

    this.state = {
      active: 0,
      values: [],
    };
  }

  componentWillMount() {
    if (this.props.options.breakpoints) {
      this.setState(this.props.options.breakpoints);
    } else {
      this.setState({ values: [defaultBreakpoint] });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextBp = nextProps.options.breakpoints;
    if (undefined === nextBp) {
      return;
    }

    // Change active bp if necessary
    if (nextBp.active !== this.state.active) {
      this.setState({ active: nextBp.active });
    }

    // Make sure that noMaxWidth is enforced if there is only 1 breakpoint
    if (1 === nextBp.values.length && !nextBp.values[0].noMaxWidth) {
      this._dispatchValues(update(nextBp.values, { 0: {
        noMaxWidth: { $set: true },
      } }));
    }
  }

  _canAddNoMaxWidth(breakpoints) {
    return 0 === breakpoints.filter((point) => point.noMaxWidth).length;
  }

  _maxWidthIsSet(updateIdx, maxWidth, breakpoints) {
    return 0 !== breakpoints.filter((point, idx) =>
      (parseInt(updateIdx, 10) !== idx && // account for numeric strings
        !point.noMaxWidth && // ok to duplicate an ignored maxWidth
        maxWidth === point.maxWidth) // now check duplication
    ).length;
  }

  _handleChange(fieldProps, newValue) {
    // break field name into index and key
    const fieldNameParts = fieldProps.name.split('.');

    // Error if trying to set multiple breakpoints to noMaxWidth
    if ('noMaxWidth' === fieldNameParts[1] &&
      newValue &&
      !this._canAddNoMaxWidth(this.state.values)
    ) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e006'));
      return;
    }

    // Error if setting multiple breakpoints to same maxWidth
    if ('maxWidth' === fieldNameParts[1] &&
      this._maxWidthIsSet(fieldNameParts[0], newValue, this.state.values)
    ) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e007'));
      return;
    }

    // merge new value as key into the updated index
    this._dispatchValues(update(this.state.values, {
      [fieldNameParts[0]]: { $merge: { [fieldNameParts[1]]: newValue } },
    }));
  }

  _removeBreakpoint(evt) {
    const idx = parseInt(evt.target.getAttribute('data-index'), 10);
    if (isNaN(idx)) {
      return;
    }
    this._dispatchValues(update(this.state.values, {
      $splice: [[idx, 1]],
    }));
  }

  _addBreakpoint() {
    this._dispatchValues(update(this.state.values, {
      $push: [
        update(defaultBreakpoint, { noMaxWidth: { $set: false } }),
      ],
    }));
  }

  _dispatchValues(values) {
    this.setState({ values });
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS_EXTEND,
      { breakpoints: { values } }
    ));
  }

  _updateActiveBreakpoint(idx, isExpanded) {
    if (isExpanded) {
      this.setState({ active: idx });
    }
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS_EXTEND,
      { breakpoints: { active: idx } }
    ));
  }

  _isSingleBp() {
    return 1 >= this.state.values.length;
  }

  _renderBreakpoint(point, idx) {
    const pointTitle = `Breakpoint ${1 + idx}`;
    const callback = (isExpanded) => {
      this._updateActiveBreakpoint(idx, isExpanded);
    };
    return (
      <AccordionBlock
        title={pointTitle}
        tooltip={`Set max width and height for ${pointTitle}`}
        key={`breakpoint.${idx}`}
        defaultExpand={this.state.active === idx}
        updateExpandOnProps
        toggleCallback={callback}
      >
        <DispatchField
          fieldType="Checkbox"
          fieldProps={{
            label: this._isSingleBp() ? 'All widths' : 'No max width',
            name: `${idx}.noMaxWidth`,
            disabled: this._isSingleBp(),
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
        {this._isSingleBp() ? '' : (
          <Button
            theme="error"
            data-index={idx}
            onClick={this._removeBreakpoint}
          >Remove</Button>
        )}
      </AccordionBlock>
    );
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
