import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Label, Heading, Select, Button, Text, Input } from 'rebass';
import AppComponent from '../Layout/AppComponent';
import * as styles from './DataInput.css';
import * as editorStyles from '../ChartEditor/ChartEditor.css';
import HelpTrigger from '../lib/HelpTrigger';
import {
  RECEIVE_RAW_DATA,
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../../constants';
import sampleData from '../../constants/sampleData';
import actionTrigger, { requestGoogleSheet } from '../../actions';
import ListBlock from '../Layout/RebassComponents/ListBlock';
import appSteps from '../../constants/appSteps';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import DateFormatter from './DateFormatter';
import ChartTitle from './ChartTitle';
import { getIsNextStepAvailable } from '../../selectors';

class DataInput extends AppComponent {
  static mapStateToProps(state) {
    return Object.assign({}, state, {
      isNextStepAvailable: getIsNextStepAvailable(state),
      canLoadSheet: !!state.googleApiKey,
    });
  }

  static sampleDataOptions() {
    return sampleData.map(({ label }, i) => ({
      children: label,
      value: i,
    }));
  }

  constructor(props) {
    super(props);
    this.submitData = this.submitData.bind(this);
    this.loadSampleData = this.loadSampleData.bind(this);
    this.requestSheet = this.requestSheet.bind(this);
    this.setSampleDataSet = this.setSampleDataSet.bind(this);
    this.setSheetId = this.setSheetId.bind(this);
    this.nextCallback = this.nextCallback.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getDataClass = this.getDataClass.bind(this);
    this.getDataMessage = this.getDataMessage.bind(this);

    this.state = {
      rawData: props.rawData,
      sampleDataSet: 0,
      googleSheetId: props.googleSheetId,
    };

    this.inputRules = [
      <span>Enter <em>clean</em> comma-delimited text here.</span>,
      'A header row is required.',
      'See sample data sets for formatting examples',
      'Chart title is suggested but not required.',
    ];
  }

  componentWillReceiveProps({ rawData, googleSheetId }) {
    if (this.props.rawData !== rawData) {
      this.setState({ rawData });
    }

    if (this.props.googleSheetId !== googleSheetId) {
      this.setState({ googleSheetId });
    }
  }

  submitData(data) {
    const rawData = data.trim();
    this.setState({ rawData }, () =>
      this.props.dispatch(actionTrigger(RECEIVE_RAW_DATA, rawData))
    );
  }

  loadSampleData() {
    this.submitData(sampleData[this.state.sampleDataSet].data);
  }

  requestSheet() {
    this.props.dispatch(requestGoogleSheet(this.state.googleSheetId));
  }

  setSampleDataSet(evt) {
    this.setState({ sampleDataSet: evt.target.value });
  }

  setSheetId(evt) {
    this.setState({ googleSheetId: evt.target.value });
  }

  nextCallback(success) {
    if (!success) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e002'));
    } else {
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    }
  }

  handleInputBlur() {
    this.submitData(this.state.rawData);
  }

  handleInputChange(evt) {
    this.setState({ rawData: evt.target.value });
  }

  getDataMessage() {
    return this.props.dataStatus.message || 'Waiting for data input';
  }

  getDataClass() {
    return this.props.dataStatus.status || 'initial';
  }

  renderSampleDataSelect() {
    return (
      <div>
        <Select
          className={styles.inputBuilderMargin}
          label="Use sample data"
          name="sample-data-select"
          options={DataInput.sampleDataOptions()}
          onChange={this.setSampleDataSet}
        />
        <div className={styles.actionsContainer}>
          <Button
            theme="warning"
            onClick={this.loadSampleData}
          >
            Load
          </Button>
        </div>
      </div>
    );
  }

  renderGoogleSheetInput() {
    return (
      <div>
        <Divider style={{ marginTop: '20px' }} />
        <div className={styles.loadSheetContainer}>
          <Input
            label="Google Sheet ID or Link"
            name="google-sheets-id"
            onChange={this.setSheetId}
            style={{ marginBottom: 0 }}
            value={this.state.googleSheetId}
          />
          <HelpTrigger docName="googleSheets" />
        </div>
        <div className={styles.actionsContainer}>
          <Button
            theme="warning"
            onClick={this.requestSheet}
          >
            Load
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { rawData } = this.state;
    const {
      canLoadSheet,
      dateFormat,
      firstCol,
      metadata,
      isNextStepAvailable,
    } = this.props;

    return (
      <div className={this.parentStyles.appComponent}>
        <Heading level={2}>{appSteps[0]}</Heading>

        <div className={editorStyles.builderContainer}>
          <div className={editorStyles.subcomponentContainer}>
            {!!rawData && <DateFormatter
              dateFormat={dateFormat}
              dates={firstCol}
            />}
            {!rawData && this.renderSampleDataSelect()}
            {!rawData && canLoadSheet && this.renderGoogleSheetInput()}
          </div>

          <div className={styles.dataContainer}>
            <ListBlock list={this.inputRules} />
            <ChartTitle metadata={metadata} />
            <div>
              <Label>Chart data</Label>
              <textarea
                id="DataInput"
                className={styles.textarea}
                value={rawData}
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
              />
              <span className={styles[this.getDataClass()]}>
                <Text small>{this.getDataMessage()}</Text>
              </span>
            </div>
            <div className={styles.actionsContainer}>
              <div className={styles.submitContainer}>
                <NextPrevButton
                  text="Next"
                  currentStep={0}
                  dir="next"
                  shouldEnable={isNextStepAvailable}
                  callback={this.nextCallback}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DataInput.propTypes = {
  rawData: PropTypes.string,
  metadata: PropTypes.object,
  dataStatus: PropTypes.object,
  dateFormat: PropTypes.object,
  firstCol: PropTypes.array,
  dispatch: PropTypes.func,
  canLoadSheet: PropTypes.bool,
  isNextStepAvailable: PropTypes.bool,
};

export default connect(DataInput.mapStateToProps)(DataInput);
