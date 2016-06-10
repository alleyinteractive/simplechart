import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appComponent } from '../../css/components.css';
import * as styles from './DataInput.css';
import { RECEIVE_RAW_DATA } from '../../constants';
import { sampleData } from '../../constants/sampleData';
import actionTrigger from '../../actions';

class DataInput extends Component {

  constructor() {
    super();
    this._submitData = this._submitData.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._loadSampleData = this._loadSampleData.bind(this);
    this.state = {
      rawData: '',
    };
    this.inputRules = [
      'Enter comma or tab delimited text here.',
      'A header row is required.',
      'The label for each row must be in the first column.',
    ];
  }

  componentWillMount() {
    this.setState({ rawData: this.props.rawData });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ rawData: nextProps.rawData });
  }

  _submitData() {
    this.props.dispatch(
      actionTrigger(RECEIVE_RAW_DATA, this.state.rawData)
    );
  }

  _updateValue(evt) {
    this.setState({ rawData: evt.target.value });
  }

  _loadSampleData(evt) {
    const sampleIndex = parseInt(evt.target.getAttribute('data-key'), 10);
    if (!isNaN(sampleIndex) && sampleData[sampleIndex]) {
      this.setState({ rawData: sampleData[sampleIndex].data });
    }
  }

  render() {
    let dataStatus = 'Waiting for data input';
    let dataStatusClass = 'default';

    if (this.props.dataStatus) {
      if (this.props.dataStatus.message) {
        dataStatus = this.props.dataStatus.message;
      }

      if (this.props.dataStatus.status) {
        dataStatusClass = this.props.dataStatus.status;
      }
    }

    return (
      <div className={appComponent}>
        <ul>
          {this.inputRules.map((rule, i) =>
            (<li key={i}>{rule}</li>)
          )}
        </ul>
        <p>Sample data sets:</p>
        <ul>
          {sampleData.map((sample, i) =>
            (<li key={i}>
              <a
                onClick={this._loadSampleData}
                data-key={i}
                href="#0"
              >
                {sample.label}
              </a>
            </li>)
          )}
        </ul>
        <textarea
          id="DataInput"
          className={styles.textarea}
          value={this.state.rawData}
          onChange={this._updateValue}
          ref="dataInput"
        />
        <button onClick={this._submitData}>Go</button>
        <span className={styles[dataStatusClass]}>
          {dataStatus}
        </span>
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
