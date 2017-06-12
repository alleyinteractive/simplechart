/* eslint-disable no-console */
import React, { Component } from 'react';
import { sendMessage } from '../../utils/postMessage';
import { Button } from 'rebass';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import { UNSAVED_CHANGES } from '../../constants';
import saveChartLabels from '../../constants/saveChartLabels';
import { getSaveData } from '../../selectors';

class SaveChart extends Component {
  static mapStateToProps(state) {
    return {
      saveData: getSaveData(state),
    };
  }

  constructor(props) {
    super(props);
    this._sendDataToParent = this._sendDataToParent.bind(this);
  }

  _sendDataToParent() {
    this.props.dispatch(actionTrigger(UNSAVED_CHANGES, false));
    sendMessage('saveChart', this.props.saveData);
  }

  _getLabel(cmsStatus) {
    return saveChartLabels[cmsStatus] || saveChartLabels.default;
  }

  render() {
    return (
      <span>
        <Button
          theme="success"
          rounded
          style={this.props.buttonStyleAttr}
          onClick={this._sendDataToParent}
        >{this._getLabel(this.props.cmsStatus)}</Button>
      </span>
    );
  }
}

SaveChart.propTypes = {
  saveData: React.PropTypes.object,
  buttonStyleAttr: React.PropTypes.object,
  cmsStatus: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect(SaveChart.mapStateToProps)(SaveChart);
