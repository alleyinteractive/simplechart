import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as styles from '../DataInput.css';
import { Switch, Label } from 'rebass';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import { RECEIVE_DATE_FORMAT } from '../../../constants';
import * as dateUtils from '../../../utils/parseDate';
import { Text } from 'rebass';
import actionTrigger from '../../../actions';

class DateFormatter extends Component {
  constructor() {
    super();
    this._toggleFormatter = this._toggleFormatter.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  componentDidUpdate() {
    if (this.props.dateFormat.enabled) {
      ReactDOM.findDOMNode(this)
        .querySelector('[name="formatString"]')
        .focus();
    }
  }

  _toggleFormatter(evt) {
    evt.preventDefault();
    this.props.dispatch(actionTrigger(RECEIVE_DATE_FORMAT, {
      enabled: !this.props.dateFormat.enabled,
    }));
  }

  _handleChange(fieldProps, newValue) {
    const testResult = dateUtils.failedList(newValue, this.props.dates);
    this.props.dispatch(actionTrigger(RECEIVE_DATE_FORMAT, {
      validated: !testResult,
      failedAt: testResult,
      formatString: newValue,
    }));
  }

  render() {
    const containerClass =
      `${styles.optionsContainer} ${styles.dateFormatterContainer}`;

    return (
      <div className={containerClass}>
        <Switch
          checked={this.props.dateFormat.enabled}
          onClick={this._toggleFormatter}
        />
        <Label>{!this.props.dateFormat.enabled ?
          'Use date formatting?' :
          'Enter date format'
        }</Label>
        <HelpTrigger docName="dateFormatter" />
        {!this.props.dateFormat.enabled ? null : (
          <DispatchField
            handler={this._handleChange}
            fieldType="Input"
            fieldProps={{
              hideLabel: true,
              label: '',
              placeholder: 'e.g. MM/DD/YYYY for 06/25/2014',
              name: 'formatString',
              style: { marginBottom: '0px', width: '300px' },
              value: this.props.dateFormat.formatString || '',
            }}
          />
        )}
        {!this.props.dateFormat.enabled || !this.props.dateFormat.formatString ?
          null :
          (<span
            className={styles[this.props.dateFormat.validated ? 'success' : 'error']}
          >
            <Text small>
              {this.props.dateFormat.validated ?
                'Date format validated' :
                `Invalid date format for ${this.props.dateFormat.failedAt}`
              }
            </Text>
          </span>)
        }
      </div>
    );
  }
}

DateFormatter.propTypes = {
  dateFormat: React.PropTypes.object,
  dates: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

export default connect()(DateFormatter);
