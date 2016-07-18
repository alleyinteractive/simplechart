import React, { Component } from 'react';
import { Fixed, Button, ButtonOutline } from 'rebass';
import logoSvg from '!!raw!../../../img/simplechartLogo.svg';
import * as styles from './ProgressHeader.css';
import { appSteps } from '../../../constants/appSteps';
import { connect } from 'react-redux';
import actionTrigger from '../../../actions';
import { UPDATE_CURRENT_STEP } from '../../../constants';

class ProgressHeader extends Component {

  constructor() {
    super();
    this._progressButtons = this._progressButtons.bind(this);
  }

  componentWillMount() {
    this.setState({
      currentStep: this.props.currentStep || 0,
      steps: appSteps,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentStep: nextProps.currentStep,
    });
  }

  _updateCurrentStep(key, evt) {
    evt.target.blur();
    this.props.dispatch(actionTrigger(
      UPDATE_CURRENT_STEP,
      key
    ));
  }

  _progressButtons() {
    return appSteps.map((label, i) => {
      const styleAttr = i > 0 ? { marginLeft: -1 } : {};
      const isCurrent = i === this.state.currentStep;
      let rounded;
      if (i === 0) {
        rounded = 'left';
      } else if (i === (appSteps.length - 1)) {
        rounded = 'right';
      } else {
        rounded = false;
      }

      const props = {
        rounded,
        style: styleAttr,
        color: 'primary',
        key: i,
        onClick: this._updateCurrentStep.bind(this, i),
      };

      if (isCurrent) {
        props.style.backgroundColor = '#e4e3e3';
      }

      return (
        React.createElement(ButtonOutline, props, label)
      );
    });
  }

  render() {
    return (
      <Fixed top left right>
        <div className={styles.inner}>
          <div
            className={styles.logoContainer}
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />

          <div className={styles.progressContainer}>
            {this._progressButtons()}
          </div>

          <div className={styles.actionsContainer}>
            <Button
              theme="success"
              rounded
              style={{ marginRight: '10px' }}
            >Save Chart</Button>

            <Button
              theme="error"
              rounded
            >Cancel</Button>
          </div>
        </div>
      </Fixed>
    );
  }
}

ProgressHeader.propTypes = {
  currentStep: React.PropTypes.number,
  dispatch: React.PropTypes.func,
};

export default connect()(ProgressHeader);
