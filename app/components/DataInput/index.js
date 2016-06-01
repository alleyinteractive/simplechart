import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appComponent } from '../../css/components.css';
import * as styles from './DataInput.css';
import { RECEIVE_RAW_DATA } from '../../constants';
import actionTrigger from '../../actions';

class DataInput extends Component {

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this.state = {
      rawData: null,
    };
  }

  _handleClick() {
    this.props.dispatch(
      actionTrigger(RECEIVE_RAW_DATA, this.refs.dataInput.value)
    );
  }

  _updateValue(evt) {
    this.setState({ rawData: evt.target.value });
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

    const rawData = this.state.rawData || this.props.rawData;

    return (
      <div className={appComponent}>
        <p>Enter comma or tab delimited text here. A header row is required.</p>
        <textarea
          id="DataInput"
          className={styles.textarea}
          value={rawData}
          onChange={this._updateValue}
          ref="dataInput"
        />
        <button onClick={this._handleClick}>Go</button>
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
