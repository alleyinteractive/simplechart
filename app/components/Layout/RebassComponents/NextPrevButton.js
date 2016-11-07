import React, { Component } from 'react';
import { Button } from 'rebass';
import { UPDATE_CURRENT_STEP } from '../../../constants';
import actionTrigger from '../../../actions';
import { connect } from 'react-redux';

class NextPrevButton extends Component {
  constructor() {
    super();
    this.changeStep = this.changeStep.bind(this);
    this.enableButton = this.enableButton.bind(this);
  }

  /**
   * Default to enabling button if no test function provided
   */
  enableButton() {
    return undefined === this.props.shouldEnable || this.props.shouldEnable();
  }

  changeStep() {
    // Reject if tester function returns false
    if (!this.enableButton()) {
      return;
    }

    const nextStep = 'prev' !== this.props.dir ?
      (this.props.currentStep + 1) : (this.props.currentStep - 1);

    this.props.dispatch(
      actionTrigger(UPDATE_CURRENT_STEP, nextStep)
    );
  }

  render() {
    return (
      <Button
        theme="primary"
        big
        onClick={this.changeStep}
      >{this.props.copy}</Button>
    );
  }
}

NextPrevButton.propTypes = {
  copy: React.PropTypes.string,
  currentStep: React.PropTypes.number,
  dir: React.PropTypes.string,
  shouldEnable: React.PropTypes.func,
  dispatch: React.PropTypes.func,
};

export default connect()(NextPrevButton);
