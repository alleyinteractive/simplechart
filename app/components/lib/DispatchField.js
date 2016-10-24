import React, { Component } from 'react';
import Rebass from 'rebass';
import update from 'react-addons-update';
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
    switch (this.props.fieldType) {
      case 'Checkbox':
        fieldValue = evt.target.checked;
        break;

      default:
        fieldValue = evt.target.value;
    }
    this._dispatchField(fieldValue);
  }

  _dispatchField(value) {
    this.props.dispatch(actionTrigger(this.props.action,
      buildDeepObject(this.props.fieldProps.name, value)));
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
