import React, { Component } from 'react';
import { Message } from 'rebass';
import update from 'react-addons-update';
import * as errorMessageStyles from './ErrorMessage.css';  // eslint-disable-line no-unused-vars
import getErrorMessage from '../../../constants/errorCode';

export default class ErrorMessage extends Component {
  render() {
    if (!this.props.code) {
      return null;
    }

    const props = update({
      inverted: true,
      rounded: true,
      theme: 'error',
      dangerouslySetInnerHTML: getErrorMessage(this.props.code),
    }, { $merge: this.props.override || {} });

    return React.createElement(Message, props);
  }
}

ErrorMessage.propTypes = {
  override: React.PropTypes.object,
  code: React.PropTypes.string,
};
