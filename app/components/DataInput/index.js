import React from 'react';
import { connect } from 'react-redux';
import AppComponent from '../Layout/AppComponent';
import * as styles from './DataInput.css';
import {
  RECEIVE_RAW_DATA,
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../../constants';
import { sampleData } from '../../constants/sampleData';
import actionTrigger from '../../actions';
import { Heading, Select, Button, Text } from 'rebass';
import ListBlock from '../Layout/RebassComponents/ListBlock';
import { appSteps } from '../../constants/appSteps';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';

class DataInput extends AppComponent {

  constructor() {
    super();
    this._submitData = this._submitData.bind(this);
    this._loadSampleData = this._loadSampleData.bind(this);
    this._setSampleDataSet = this._setSampleDataSet.bind(this);
    this._beforeNextStep = this._beforeNextStep.bind(this);

    this.state = {
      rawData: '',
      sampleDataSet: 0,
    };
    this.inputRules = [
      'Enter <em>clean</em> comma-delimited text here.',
      'A header row is required.',
      'See sample data sets for formatting examples',
    ];
  }

  componentWillMount() {
    this.setState({ rawData: this.props.rawData });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ rawData: nextProps.rawData });
  }

  _submitData(data) {
    // setState is async so we apply trim() twice
    this.setState({ rawData: data.trim() });
    this.props.dispatch(
      actionTrigger(RECEIVE_RAW_DATA, data.trim())
    );
  }

  _loadSampleData() {
    this._submitData(sampleData[this.state.sampleDataSet].data);
  }

  _sampleDataOptions() {
    function getOpt(set, i) {
      return {
        children: set.label,
        value: i,
      };
    }
    return sampleData.map((set, i) =>
      getOpt(set, i)
    );
  }

  _setSampleDataSet(evt) {
    this.setState({
      sampleDataSet: evt.target.value,
    });
  }

  _beforeNextStep() {
    // Check for empty data field
    // Errors w/ invalid data would have already surfaced in rawDataMiddleware
    /**
     * @todo Move this check so that this function only returns whether we can proceed
     * Checking inside _submitData() allowed "field is empty" error on all blur events
     * But we only want to allow it when you're trying to move to the next step
     */
    if (!this.props.rawData.length) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e002'));
    } else {
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    }

    // return value indicates if we can proceed to next step
    return this.props.dataStatus.status &&
      'success' === this.props.dataStatus.status;
  }

  render() {
    let dataStatus = 'Waiting for data input';
    let dataStatusClass = 'initial';

    if (this.props.dataStatus) {
      if (this.props.dataStatus.message) {
        dataStatus = this.props.dataStatus.message;
      }

      if (this.props.dataStatus.status) {
        dataStatusClass = this.props.dataStatus.status;
      }
    }

    const handleInputBlur = function handleInputBlur() {
      this._submitData(this.state.rawData);
    }.bind(this);

    const handleInputChange = function handleInputChange(evt) {
      this.setState({ rawData: evt.target.value });
    }.bind(this);

    return (
      <div className={this.parentStyles.appComponent}>
        <Heading level={2}>{appSteps[0]}</Heading>
        <ListBlock list={this.inputRules} />
        <div>
          <textarea
            id="DataInput"
            className={styles.textarea}
            value={this.state.rawData}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            ref="dataInput"
          />
          <span className={styles[dataStatusClass]}>
            <Text small>{dataStatus}</Text>
          </span>
        </div>

        <div className={styles.actionsContainer}>
          <div className={styles.sampleDataContainer}>
            <Select
              className={styles.sampleDataContainer.Select}
              style={{ marginBottom: 0 }}
              label="Use sample data"
              name="sample-data-select"
              options={this._sampleDataOptions()}
              onChange={this._setSampleDataSet}
            />
            <Button
              theme="secondary"
              onClick={this._loadSampleData}
            >Load</Button>
          </div>

          <div className={styles.submitContainer}>
            <NextPrevButton
              copy="Next"
              currentStep={0}
              dir="next"
              allowIf={this._beforeNextStep}
            />
          </div>
        </div>
      </div>
    );
  }

}

DataInput.propTypes = {
  rawData: React.PropTypes.string,
  dataStatus: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(DataInput);
