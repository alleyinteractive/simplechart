import React, { Component } from 'react';
import Rebass from 'rebass';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';

class DispatchFields extends Component {
  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._dispatchBool = this._dispatchBool.bind(this);
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
    switch (this.props.fieldType) {
      case 'Checkbox':
      default:
        this._dispatchBool(evt.target.checked);
    }
  }

  _dispatchBool(checked) {
    this.props.dispatch(actionTrigger(this.props.action,
      this._getDispatchObject(this.props.fieldProps.name, checked)));
  }

  /**
   * Build a multilevel object from a string like foo.bar.bop into an object like
   * { foo: { bar: { bop: fieldValue } } }
   * to use with https://facebook.github.io/react/docs/update.html
   *
   * @param string fieldName Use dots to indicate multiple levels for deep merge
   * @param any fieldValue Value to apply to the deepest level of the name string
   * @return obj
   */
  _getDispatchObject(fieldName, fieldValue) {
    let dispatchObj;
    const fieldNameParts = fieldName.split('.');

    // work backwards and construct the object from the inside out
    fieldNameParts.reverse();
    fieldNameParts.forEach((part, index) => {
      if (0 === index) {
        dispatchObj = { [part]: fieldValue };
      } else {
        dispatchObj = { [part]: dispatchObj };
      }
    });
    return dispatchObj;
  }

  render() {
    return !Rebass[this.props.fieldType] ?
      null :
      React.createElement(
        Rebass[this.props.fieldType], this.state.fieldProps);
  }
}

DispatchFields.propTypes = {
  dispatch: React.PropTypes.func,
  action: React.PropTypes.string,
  fieldProps: React.PropTypes.object,
  fieldType: React.PropTypes.string,
};

export default connect()(DispatchFields);
