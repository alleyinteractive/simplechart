/* eslint-disable no-console */
import React, { Component } from 'react';
import { sendMessage } from '../../utils/postMessage';
import { Button } from 'rebass';

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
};

export default SaveChart;
