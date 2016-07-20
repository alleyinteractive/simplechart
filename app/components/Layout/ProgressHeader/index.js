import React, { Component } from 'react';
import { Fixed, Button, SequenceMap } from 'rebass';
import logoSvg from '!!raw!../../../img/simplechartLogo.svg';
import * as styles from './ProgressHeader.css';
import { appSteps } from '../../../constants/appSteps';
import { connect } from 'react-redux';
import actionTrigger from '../../../actions';
import { UPDATE_CURRENT_STEP } from '../../../constants';
import SaveChart from '../../SaveChart';
import { sendMessage } from '../../../utils/postMessage';
import ErrorMessage from '../RebassComponents/ErrorMessage';

class ProgressHeader extends Component {

  constructor() {
    super();
    this._sequenceMap = this._sequenceMap.bind(this);
    this._cancelEdits = this._cancelEdits.bind(this);
    this._renderUnsavedWarning = this._renderUnsavedWarning.bind(this);
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

  _updateCurrentStep(key, evt) {
    evt.target.blur();
    this.props.dispatch(actionTrigger(
      UPDATE_CURRENT_STEP,
      key
    ));
  }

  _sequenceMap() {
    const mapSteps = appSteps.map((label, i) => ({
      children: label,
      href: `#step-${i}`,
      onClick: this._updateCurrentStep.bind(this, i),
    }));

    return (
      <SequenceMap
        active={this.state.currentStep}
        steps={mapSteps}
      />
    );
  }

  _cancelEdits() {
    if (!this.props.unsavedChanges) {
      sendMessage('closeApp');
      return;
    }
    this.setState({ showUnsavedWarning: true });
  }

  _renderUnsavedWarning() {
    if (!this.state.showUnsavedWarning) {
      return '';
    }

    const discardChanges = function() {
      sendMessage('closeApp');
      this.setState({ showUnsavedWarning: false });
    }.bind(this);

    const closeWarning = function() {
      this.setState({ showUnsavedWarning: false });
    }.bind(this);

    return (
      <ErrorMessage>
        You have unsaved changes.
        <a href="#" onClick={discardChanges}>Discard changes</a> or
        <a href="#" onClick={closeWarning}>cancel</a>.
      </ErrorMessage>
    );
  }

  render() {
    return (
      <Fixed top left right style={{ zIndex: 99 }}>
        <div className={styles.inner}>
          <div
            className={styles.logoContainer}
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />

          <div className={styles.sequenceContainer}>
            {this._sequenceMap()}
          </div>

          <div className={styles.actionsContainer}>
            <SaveChart
              saveData={this.props.saveData}
              buttonStyleAttr={{ marginRight: '10px' }}
            />

            <Button
              theme="error"
              rounded
              onClick={this._cancelEdits}
            >Exit</Button>
          </div>
        </div>
        <div className={styles.unsavedWarning}>
          {this._renderUnsavedWarning()}
        </div>
      </Fixed>
    );
  }
}

ProgressHeader.propTypes = {
  saveData: React.PropTypes.object,
  currentStep: React.PropTypes.number,
  dispatch: React.PropTypes.func,
  unsavedChanges: React.PropTypes.bool,
};

export default connect()(ProgressHeader);
