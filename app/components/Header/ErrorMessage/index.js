import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Message, Close } from 'rebass';
import update from 'react-addons-update';
import * as styles from './ErrorMessage.css';
import getErrorMessage from '../../../constants/errorCode';
import { CLEAR_ERROR } from '../../../constants';
import actionTrigger from '../../../actions';

class ErrorMessage extends Component {
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

    const closeErrorMessage = function() {
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    }.bind(this);

    return (
      <div className={styles.container}>
        {React.createElement(Message, props)}
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
};

export default connect()(ErrorMessage);
