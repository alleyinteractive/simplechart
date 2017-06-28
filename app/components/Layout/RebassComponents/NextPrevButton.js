import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'rebass';
import { connect } from 'react-redux';
import { UPDATE_CURRENT_STEP } from '../../../constants';
import actionTrigger from '../../../actions';

class NextPrevButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    currentStep: PropTypes.number.isRequired,
    dir: PropTypes.string.isRequired,
    shouldEnable: PropTypes.bool,
    callback: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    shouldEnable: true,
    callback: () => {},
  };

  /**
   * Default to enabling button
   */
  enableButton = () => this.props.shouldEnable;

  disableStyles = () => (
    this.enableButton() ? {} :
    {
      cursor: 'default',
      backgroundColor: 'rgb(136, 136, 136)',
    }
  );

  changeStep = () => {
    const buttonIsEnabled = this.enableButton();

    // Change the currentStep if the button is enabled
    if (buttonIsEnabled) {
      const nextStep = 'prev' !== this.props.dir ?
        (this.props.currentStep + 1) : (this.props.currentStep - 1);

      this.props.dispatch(
        actionTrigger(UPDATE_CURRENT_STEP, nextStep)
      );
    }

    this.props.callback(buttonIsEnabled);
  };

  render() {
    return (
      <span className={this.enableButton() ? '' : 'disabled'}>
        <Button
          theme="primary"
          big
          onClick={this.changeStep}
          style={this.disableStyles()}
        >{this.props.text}</Button>
      </span>
    );
  }
}

export default connect()(NextPrevButton);
