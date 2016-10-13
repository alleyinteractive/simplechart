import React, { Component } from 'react';
import { Button } from 'rebass';
import { UPDATE_CURRENT_STEP } from '../../../constants';
import actionTrigger from '../../../actions';
import { connect } from 'react-redux';

class NextPrevButton extends Component {
  constructor() {
    super();
    this.changeStep = this.changeStep.bind(this);
  }

  changeStep() {
    // Reject if tester function returns false
    if (typeof this.props.allowIf === 'function' && !this.props.allowIf()) {
      return;
    }

    const nextStep = this.props.dir !== 'prev' ?
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
  allowIf: React.PropTypes.func,
  dispatch: React.PropTypes.func,
};

export default connect()(NextPrevButton);
