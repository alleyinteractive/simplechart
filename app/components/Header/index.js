import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fixed, Button, SequenceMap } from 'rebass';
import { connect } from 'react-redux';
import logoSvg from '!!raw-loader!../../img/simplechartLogo.svg'; // eslint-disable-line
import * as styles from './Header.css';
import { appSteps } from '../../constants/appSteps';
import actionTrigger from '../../actions';
import { UPDATE_CURRENT_STEP } from '../../constants';
import SaveChart from '../SaveChart';
import { sendMessage } from '../../utils/postMessage';
import ErrorMessage from './ErrorMessage';
import { getIsNextStepAvailable } from '../../selectors';

class Header extends Component {
  static mapStateToProps(state) {
    return Object.assign({}, state, {
      isNextStepAvailable: getIsNextStepAvailable(state),
    });
  }

  constructor() {
    super();
    this.sequenceSteps = this.sequenceSteps.bind(this);
    this.cancelEdits = this.cancelEdits.bind(this);
    this.renderUnsavedWarning = this.renderUnsavedWarning.bind(this);
    this.closeUnsavedWarning = this.closeUnsavedWarning.bind(this);
  }

  componentWillMount() {
    this.setState({
      currentStep: this.props.currentStep || 0,
      steps: appSteps,
      showUnsavedWarning: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentStep: nextProps.currentStep,
    });
  }

  updateCurrentStep(step, evt) {
    if (step > this.state.currentStep && !this.props.isNextStepAvailable) {
      return;
    }

    evt.target.blur();
    this.props.dispatch(actionTrigger(
      UPDATE_CURRENT_STEP,
      step
    ));
  }

  sequenceSteps() {
    return appSteps.map((label, i) => ({
      children: label,
      onClick: this.updateCurrentStep.bind(this, i),
    }));
  }

  cancelEdits() {
    if (!this.props.unsavedChanges) {
      sendMessage('closeApp');
      return;
    }
    this.setState({ showUnsavedWarning: true });
  }

  closeUnsavedWarning(evt) {
    if (evt.target.hasAttribute('data-closeApp')) {
      sendMessage('closeApp');
    }
    this.setState({ showUnsavedWarning: false });
  }

  /**
   * Special case since we need to render JSX inside the ErrorMessage component
   */
  renderUnsavedWarning() {
    if (!this.state.showUnsavedWarning) {
      return '';
    }

    return (
      <ErrorMessage code="e000">
        You have unsaved changes.&nbsp;
        <a
          href="#0"
          data-closeApp
          onClick={this.closeUnsavedWarning}
        >Exit without saving</a>
        &nbsp;or&nbsp;
        <a href="#0" onClick={this.closeUnsavedWarning}>keep working</a>.
      </ErrorMessage>
    );
  }

  render() {
    return (
      <Fixed top left right style={{ zIndex: 99 }}>
        <div className={styles.inner}>
          <div
            className={styles.logoContainer}
            dangerouslySetInnerHTML={{ __html: logoSvg }} // eslint-disable-line react/no-danger
          />

          <div className={styles.sequenceContainer}>
            <SequenceMap
              active={this.state.currentStep}
              steps={this.sequenceSteps()}
            />
          </div>

          <div className={styles.actionsContainer}>
            <SaveChart
              buttonStyleAttr={{ marginRight: '10px' }}
              cmsStatus={this.props.cmsStatus}
            />

            <Button
              theme="error"
              rounded
              onClick={this.cancelEdits}
            >Exit</Button>
          </div>
        </div>
        {this.props.errorCode ?
          (<ErrorMessage code={this.props.errorCode}>{false}</ErrorMessage>) :
          this.renderUnsavedWarning()
        }
      </Fixed>
    );
  }
}

Header.propTypes = {
  currentStep: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,
  errorCode: PropTypes.string.isRequired,
  cmsStatus: PropTypes.string.isRequired,
  isNextStepAvailable: PropTypes.bool.isRequired,
};

export default connect(Header.mapStateToProps)(Header);
