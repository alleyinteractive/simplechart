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
    this._sendDataToParent = this._sendDataToParent.bind(this);
  }

  _sendDataToParent() {
    this.props.dispatch(actionTrigger(UNSAVED_CHANGES, false));
    sendMessage('saveChart', this.props.saveData);
  }

  render() {
    return (
      <span>
        <Button
          theme="success"
          rounded
          style={this.props.buttonStyleAttr}
          onClick={this._sendDataToParent}
        >{this.props.children}</Button>
      </span>
    );
  }
}

SaveChart.propTypes = {
  saveData: React.PropTypes.object,
  buttonStyleAttr: React.PropTypes.object,
  children: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(SaveChart);
