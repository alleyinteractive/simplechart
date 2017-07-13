/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'rebass';
import { connect } from 'react-redux';
import { sendMessage } from '../../utils/postMessage';
import actionTrigger from '../../actions';
import { UNSAVED_CHANGES } from '../../constants';
import saveChartLabels from '../../constants/saveChartLabels';
import { getSaveData } from '../../selectors';

class SaveChart extends Component {
  static propTypes = {
    saveData: PropTypes.object.isRequired,
    buttonStyleAttr: PropTypes.object.isRequired,
    cmsStatus: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static mapStateToProps(state) {
    return {
      saveData: getSaveData(state),
    };
  }

  static getLabel(cmsStatus) {
    return saveChartLabels[cmsStatus] || saveChartLabels.default;
  }

  sendDataToParent = () => {
    this.props.dispatch(actionTrigger(UNSAVED_CHANGES, false));
    sendMessage('saveChart', this.props.saveData);
  };

  render() {
    return (
      <span>
        <Button
          theme="success"
          rounded
          style={this.props.buttonStyleAttr}
          onClick={this.sendDataToParent}
        >{SaveChart.getLabel(this.props.cmsStatus)}</Button>
      </span>
    );
  }
}

export default connect(SaveChart.mapStateToProps)(SaveChart);
