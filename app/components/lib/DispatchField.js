import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rebass from 'rebass';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import buildDeepObject from '../../utils/buildDeepObject';

class DispatchField extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    action: PropTypes.string,
    fieldProps: PropTypes.object.isRequired,
    fieldType: PropTypes.string.isRequired,
    handler: PropTypes.func,
  };

  static defaultProps = {
    action: '',
    handler: () => {},
  };

  componentWillMount() {
    this.setState({
      fieldProps: update(this.props.fieldProps,
        { $merge: { onChange: this.handleChange } }),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fieldProps: update(nextProps.fieldProps,
        { $merge: { onChange: this.handleChange } }),
    });
  }

  handleChange = (evt) => {
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
    this.dispatchField(fieldValue);
  };

  dispatchField = (value) => {
    // If no action provided, just call the handler
    if ('' === this.props.action && this.props.handler) {
      this.props.handler(this.props.fieldProps, value);
      return;
    }

    this.props.dispatch(actionTrigger(
      this.props.action || 'UNSPECIFIED_ACTION',
      this.props.handler ?
        this.props.handler(this.props.fieldProps, value) :
        buildDeepObject(this.props.fieldProps.name, value)
    ));
  };

  render() {
    return !Rebass[this.props.fieldType] ?
      null :
      React.createElement(
        Rebass[this.props.fieldType], this.state.fieldProps);
  }
}

export default connect()(DispatchField);
