import React, { Component } from 'react';
import Rebass from 'rebass';
import { UPDATE_CURRENT_STEP } from '../../../constants';
import actionTrigger from '../../../actions';
import { connect } from 'react-redux';

class NextPrevButton extends Component {
  constructor() {
    super();
    this.changeStep = this.changeStep.bind(this);
  }

  changeStep() {
    const nextStep = this.props.dir !== 'prev' ?
      (this.props.currentStep + 1) : (this.props.currentStep - 1);

    this.props.dispatch(
      actionTrigger(UPDATE_CURRENT_STEP, nextStep)
    );
  }

  render() {
    return (
      <Rebass.Button
        theme="primary"
        big
        onClick={this.changeStep}
      >{this.props.copy}</Rebass.Button>
    );
  }
}

NextPrevButton.propTypes = {
  copy: React.PropTypes.string,
  currentStep: React.PropTypes.number,
  dir: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(NextPrevButton);
