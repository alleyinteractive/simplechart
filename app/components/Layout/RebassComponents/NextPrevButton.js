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
    this.disableStyles = this.disableStyles.bind(this);
  }

  /**
   * Default to enabling button
   */
  enableButton() {
    return !this.props.hasOwnProperty('shouldEnable') || this.props.shouldEnable;
  }

  disableStyles() {
    return this.enableButton() ? {} :
      {
        cursor: 'default',
        backgroundColor: 'rgb(136, 136, 136)',
      };
  }

  changeStep() {
    const buttonIsEnabled = this.enableButton();

    // Change the currentStep if the button is enabled
    if (buttonIsEnabled) {
      const nextStep = 'prev' !== this.props.dir ?
        (this.props.currentStep + 1) : (this.props.currentStep - 1);

      this.props.dispatch(
        actionTrigger(UPDATE_CURRENT_STEP, nextStep)
      );
    }

    // If a callback is provided, call it
    if ('function' === typeof this.props.callback) {
      this.props.callback(buttonIsEnabled);
    }
  }

  render() {
    return (
      <span className={this.enableButton() ? '' : 'disabled'}>
        <Button
          theme="primary"
          big
          onClick={this.changeStep}
          style={this.disableStyles()}
        >{this.props.copy}</Button>
      </span>
    );
  }
}

NextPrevButton.propTypes = {
  copy: React.PropTypes.string,
  currentStep: React.PropTypes.number,
  dir: React.PropTypes.string,
  shouldEnable: React.PropTypes.bool,
  callback: React.PropTypes.func,
  dispatch: React.PropTypes.func,
};

export default connect()(NextPrevButton);
