import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this._validate = this._validate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dates.toString() !== this.props.dates.toString()) {
      this._validate(nextProps.dateFormat.formatString, nextProps.dates);
    }
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
    this._validate(newValue, this.props.dates);
  }

  _validate(formatString, dates) {
    const testResult = dateUtils.disproveList(formatString, dates);
    this.props.dispatch(actionTrigger(RECEIVE_DATE_FORMAT, {
      validated: !testResult,
      failedAt: testResult,
      formatString,
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
          ''
        }</Label>
        {!this.props.dateFormat.enabled ? null : (
          <DispatchField
            handler={this._handleChange}
            fieldType="Input"
            fieldProps={{
              hideLabel: true,
              label: '',
              placeholder: 'MM/DD/YYYY for 06/25/2014',
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
        <HelpTrigger docName="dateFormatter" />
      </div>
    );
  }
}

DateFormatter.propTypes = {
  dateFormat: PropTypes.object,
  dates: PropTypes.array,
  dispatch: PropTypes.func,
};

export default connect()(DateFormatter);
