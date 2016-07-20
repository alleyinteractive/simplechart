/* eslint-disable no-console */
import React, { Component } from 'react';
import { sendMessage } from '../../utils/postMessage';
import { Button } from 'rebass';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import { UNSAVED_CHANGES } from '../../constants';

class SaveChart extends Component {
  constructor() {
    super();
    this._sendParentMessage = this._sendParentMessage.bind(this);
    this._sendDataToParent = this._sendDataToParent.bind(this);
  }

  _sendDataToParent() {
    // send each element in saveData individually
    Object.keys(this.props.saveData).forEach((key) =>
      this._sendParentMessage(key)
    );
    this.props.dispatch(actionTrigger(UNSAVED_CHANGES, false));
    sendMessage('closeApp');
  }

  _sendParentMessage(key) {
    if (this.props.saveData[key]) {
      sendMessage(`save-${key}`, this.props.saveData[key]);
    }
  }

  render() {
    return (
      <span>
        <Button
          theme="success"
          rounded
          style={this.props.buttonStyleAttr}
          onClick={this._sendDataToParent}
        >Save Chart</Button>
      </span>
    );
  }
}

SaveChart.propTypes = {
  saveData: React.PropTypes.object,
  buttonStyleAttr: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(SaveChart);
