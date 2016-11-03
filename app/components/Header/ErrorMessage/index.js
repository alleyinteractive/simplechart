import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Message, Close } from 'rebass';
import update from 'react-addons-update';
import * as styles from './ErrorMessage.css';
import getErrorMessage from '../../../utils/errorCodeUtils';
import { CLEAR_ERROR } from '../../../constants';
import actionTrigger from '../../../actions';

class ErrorMessage extends Component {
  render() {
    if (!this.props.code && !this.props.children.length) {
      return null;
    }

    const props = update({
      inverted: true,
      rounded: true,
      theme: 'error',
    }, { $merge: this.props.override || {} });

    if (this.props.code) {
      props.dangerouslySetInnerHTML = getErrorMessage(this.props.code);
    }

    const closeErrorMessage = function closeErrorMessage() {
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    }.bind(this);

    return (
      <div className={styles.container}>
        {React.createElement(Message, props, this.props.children)}
        <span
          className={styles.closeContainer}
          onClick={closeErrorMessage}
        >
          <Close />
        </span>
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  override: React.PropTypes.object,
  code: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  children: React.PropTypes.any.isRequired,
};

export default connect()(ErrorMessage);
