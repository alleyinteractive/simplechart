import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Message, Close } from 'rebass';
import update from 'react-addons-update';
import * as styles from './ErrorMessage.css';
import getErrorMessage from '../../../utils/errorCodeUtils';
import { CLEAR_ERROR } from '../../../constants';
import actionTrigger from '../../../actions';

class ErrorMessage extends Component {
  constructor() {
    super();
    this.closeErrorMessage = this.closeErrorMessage.bind(this);
    this.state = {
      open: false,
      children: false,
      messageProps: {},
    };

    this.defaultMessageProps = {
      inverted: true,
      rounded: true,
      theme: 'error',
    };
  }

  componentWillMount() {
    // set default props to send to <Message />
    this.setState({
      messageProps: update(this.defaultMessageProps, {
        $merge: this.props.override || {},
      }),
    });

    this.setState(this.toSetState(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.toSetState(nextProps));
  }

  toSetState(props) {
    let innerHTML;
    if (this.props.code && 'e000' !== this.props.code) {
      // If valid non-ignore code provided
      innerHTML = getErrorMessage(this.props.code);
    } else if (!this.props.children) {
      // Default message if no children or code provided
      innerHTML = getErrorMessage('default');
    } else {
      // no need for innerHTML if children were provided
      innerHTML = null;
    }

    return {
      open: !!props.code || 0 < props.children.toString().length,
      innerHTML,
    };
  }

  closeErrorMessage() {
    this.setState({ open: false, children: false });
    this.props.dispatch(actionTrigger(CLEAR_ERROR));
  }

  render() {
    if (!this.state.open) {
      return null;
    }

    // Merge innerHTML into <Message /> props if needed
    let messageRenderProps = this.state.messageProps;
    if (this.state.innerHTML) {
      messageRenderProps = update(messageRenderProps, {
        dangerouslySetInnerHTML: { $set: this.state.innerHTML },
      });
    }

    return (
      <div className={styles.container}>
        <div className={styles.errorMessageContent}>
        {messageRenderProps.dangerouslySetInnerHTML ?
          // Render <Message /> with provided error code message or children
          React.createElement(Message, messageRenderProps) :
          React.createElement(Message, messageRenderProps, this.props.children)
        }
        </div>
        <span
          className={styles.closeContainer}
          onClick={this.closeErrorMessage}
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
