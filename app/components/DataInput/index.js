import React from 'react';
import { connect } from 'react-redux';
import AppComponent from '../Layout/AppComponent';
import * as styles from './DataInput.css';
import * as editorStyles from '../ChartEditor/ChartEditor.css';
import HelpTrigger from '../lib/HelpTrigger';
import {
  RECEIVE_RAW_DATA,
  RECEIVE_ERROR,
  CLEAR_ERROR,
} from '../../constants';
import { sampleData } from '../../constants/sampleData';
import actionTrigger, { requestGoogleSheet } from '../../actions';
import { Divider, Label, Heading, Select, Button, Text, Input } from 'rebass';
import ListBlock from '../Layout/RebassComponents/ListBlock';
import { appSteps } from '../../constants/appSteps';
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

  constructor(props) {
    super(props);
    this._submitData = this._submitData.bind(this);
    this._loadSampleData = this._loadSampleData.bind(this);
    this._requestSheet = this._requestSheet.bind(this);
    this._setSampleDataSet = this._setSampleDataSet.bind(this);
    this._setSheetId = this._setSheetId.bind(this);
    this._nextCallback = this._nextCallback.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._getDataClass = this._getDataClass.bind(this);
    this._getDataMessage = this._getDataMessage.bind(this);

    this.state = {
      rawData: props.rawData,
      sampleDataSet: 0,
      sheetId: '',
    };

    this.inputRules = [
      'Enter <em>clean</em> comma-delimited text here.',
      'A header row is required.',
      'See sample data sets for formatting examples',
      'Chart title is suggested but not required.',
    ];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rawData !== nextProps.rawData) {
      this.setState({ rawData: nextProps.rawData });
    }
  }

  _submitData(data) {
    const rawData = data.trim();
    this.setState({ rawData }, () =>
      this.props.dispatch(actionTrigger(RECEIVE_RAW_DATA, rawData))
    );
  }

  _loadSampleData() {
    this._submitData(sampleData[this.state.sampleDataSet].data);
  }

  _requestSheet() {
    this.props.dispatch(requestGoogleSheet(this.state.sheetId));
  }

  _sampleDataOptions() {
    return sampleData.map(({ label }, i) => ({
      children: label,
      value: i,
    }));
  }

  _setSampleDataSet(evt) {
    this.setState({ sampleDataSet: evt.target.value });
  }

  _setSheetId(evt) {
    this.setState({ sheetId: evt.target.value });
  }

  _nextCallback(success) {
    if (!success) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e002'));
    } else {
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    }
  }

  _handleInputBlur() {
    this._submitData(this.state.rawData);
  }

  _handleInputChange(evt) {
    this.setState({ rawData: evt.target.value });
  }

  _getDataMessage() {
    return this.props.dataStatus.message || 'Waiting for data input';
  }

  _getDataClass() {
    return this.props.dataStatus.status || 'initial';
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

            {!rawData && <div>
              <Select
                className={styles.inputBuilderMargin}
                label="Use sample data"
                name="sample-data-select"
                options={this._sampleDataOptions()}
                onChange={this._setSampleDataSet}
              />
              <div className={styles.actionsContainer}>
                <Button
                  theme="warning"
                  onClick={this._loadSampleData}
                >
                  Load
                </Button>
              </div>
            </div>}

            {!rawData && canLoadSheet && <div>
              <Divider style={{ marginTop: '20px' }} />
              <div className={styles.loadSheetContainer}>
                <Input
                  label="Google Sheet ID or Link"
                  name="google-sheets-id"
                  onChange={this._setSheetId}
                  style={{ marginBottom: 0 }}
                />
                <HelpTrigger docName="googleSheets" />
              </div>
              <div className={styles.actionsContainer}>
                <Button
                  theme="warning"
                  onClick={this._requestSheet}
                >
                  Load
                </Button>
              </div>
            </div>}
          </div>

          <div className={editorStyles.chartContainer}>
            <ListBlock list={this.inputRules} />
            <ChartTitle metadata={metadata} />
            <div>
              <Label>Chart data</Label>
              <textarea
                id="DataInput"
                className={styles.textarea}
                value={rawData}
                onChange={this._handleInputChange}
                onBlur={this._handleInputBlur}
                ref="dataInput"
              />
              <span className={styles[this._getDataClass()]}>
              <Text small>{this._getDataMessage()}</Text>
            </span>
            </div>
            <div className={styles.actionsContainer}>
              <div className={styles.submitContainer}>
                <NextPrevButton
                  text="Next"
                  currentStep={0}
                  dir="next"
                  shouldEnable={isNextStepAvailable}
                  callback={this._nextCallback}
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
  rawData: React.PropTypes.string,
  metadata: React.PropTypes.object,
  dataStatus: React.PropTypes.object,
  dateFormat: React.PropTypes.object,
  firstCol: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  canLoadSheet: React.PropTypes.bool,
  isNextStepAvailable: React.PropTypes.bool,
};

export default connect(DataInput.mapStateToProps)(DataInput);
