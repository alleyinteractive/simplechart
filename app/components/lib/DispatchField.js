import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rebass from 'rebass';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import buildDeepObject from '../../utils/buildDeepObject';

class DispatchFields extends Component {
  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._dispatchField = this._dispatchField.bind(this);
  }

  componentWillMount() {
    this.setState({
      fieldProps: update(this.props.fieldProps,
        { $merge: { onChange: this._handleChange } }),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fieldProps: update(nextProps.fieldProps,
        { $merge: { onChange: this._handleChange } }),
    });
  }

  _handleChange(evt) {
    let fieldValue;
    if ('Checkbox' === this.props.fieldType) {
      fieldValue = evt.target.checked;
    } else {
      fieldValue = evt.target.value;
    }

    // Convert number fields to float or integer
    if ('number' === evt.target.type) {
      fieldValue = ('any' === evt.target.step) ?
        parseFloat(fieldValue, 10) : parseInt(fieldValue, 10);
    }
    this._dispatchField(fieldValue);
  }

  _dispatchField(value) {
    // If no action provided, just call the handler
    if (undefined === this.props.action && this.props.handler) {
      this.props.handler(this.props.fieldProps, value);
      return;
    }

    this.props.dispatch(actionTrigger(
      this.props.action || 'UNSPECIFIED_ACTION',
      this.props.handler ?
        this.props.handler(this.props.fieldProps, value) :
        buildDeepObject(this.props.fieldProps.name, value)
    ));
  }

  render() {
    return !Rebass[this.props.fieldType] ?
      null :
      React.createElement(
        Rebass[this.props.fieldType], this.state.fieldProps);
  }
}

DispatchFields.propTypes = {
  dispatch: PropTypes.func,
  action: PropTypes.string,
  fieldProps: PropTypes.object,
  fieldType: PropTypes.string,
  handler: PropTypes.func,
};

export default connect()(DispatchFields);
