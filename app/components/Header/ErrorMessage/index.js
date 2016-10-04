import React, { Component } from 'react';
import { Message } from 'rebass';
import update from 'react-addons-update';
import styles from './ErrorMessage.css';

export default class ErrorMessage extends Component {
  render() {
    const props = update({
      inverted: true,
      rounded: true,
      theme: 'error',
      className: styles.ErrorMessage,
    }, { $merge: this.props.override || {} });

    return React.createElement(Message, props,
      this.props.children); // eslint-disable-line react/prop-types
  }
}

ErrorMessage.propTypes = {
  override: React.PropTypes.object,
};
