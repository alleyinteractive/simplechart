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
import { Label, Heading, Select, Button, Text, Input } from 'rebass';
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
    });
  }

  constructor(props) {
    super(props);
    this._submitData = this._submitData.bind(this);
    this._loadSampleData = this._loadSampleData.bind(this);
    this._setSampleDataSet = this._setSampleDataSet.bind(this);
    this._nextCallback = this._nextCallback.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);

    this.state = {
      rawData: props.rawData,
      sampleDataSet: 0,
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

  _sampleDataOptions() {
    return sampleData.map(({ label }, i) => ({
      children: label,
      value: i,
    }));
  }

  _setSampleDataSet(evt) {
    this.setState({
      sampleDataSet: evt.target.value,
    });
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

    // put buttons underneath inputs
    return (
      <div className={this.parentStyles.appComponent}>
        <Heading level={2}>{appSteps[0]}</Heading>

        <div style={{ display: 'flex', marginTop: '30px' }}>
          <div style={{ width: '330px' }}>

            {!!this.state.rawData && <DateFormatter
              dateFormat={this.props.dateFormat}
              dates={this.props.firstCol}
            />}

            {!this.state.rawData && <div className={styles.optionsContainer}>
              <Select
                className={styles.optionsContainer.Select}
                style={{ marginBottom: 0 }}
                label="Use sample data"
                name="sample-data-select"
                options={this._sampleDataOptions()}
                onChange={this._setSampleDataSet}
              />
              <Button
                theme="warning"
                onClick={this._loadSampleData}
              >
                Load
              </Button>
            </div>}

            {!this.state.rawData && <div>
              <Input
                className={styles.optionsContainer.Select}
                style={{ marginBottom: 0 }}
                label="Google Sheet ID or Link"
                name="sample-data-select"
                options={this._sampleDataOptions()}
                onChange={this._setSampleDataSet}
              />
              <Button
                theme="warning"
              >
                Load
              </Button>
            </div>}
          </div>

          <div style={{
            paddingLeft: '20px',
            borderLeft: '1px solid gray',
            marginLeft: '20px',
            flexGrow: 99,
          }}>
            <ListBlock list={this.inputRules} />
            <ChartTitle metadata={this.props.metadata} />
            <div>
              <Label>Chart data</Label>
              <textarea
                id="DataInput"
                className={styles.textarea}
                value={this.state.rawData}
                onChange={this._handleInputChange}
                onBlur={this._handleInputBlur}
                ref="dataInput"
              />
              <span className={styles[dataStatusClass]}>
              <Text small>{dataStatus}</Text>
            </span>
            </div>

            <div className={styles.actionsContainer}>

              <div className={styles.submitContainer}>
                <NextPrevButton
                  text="Next"
                  currentStep={0}
                  dir="next"
                  shouldEnable={this.props.isNextStepAvailable}
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
  isNextStepAvailable: React.PropTypes.bool,
};

export default connect(DataInput.mapStateToProps)(DataInput);
