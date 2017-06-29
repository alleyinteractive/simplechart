import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Label, Text } from 'rebass';
import * as styles from '../DataInput.css';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import { RECEIVE_DATE_FORMAT } from '../../../constants';
import * as dateUtils from '../../../utils/parseDate';
import actionTrigger from '../../../actions';

class DateFormatter extends Component {
  static propTypes = {
    dateFormat: PropTypes.object.isRequired,
    dates: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.dates.toString() !== this.props.dates.toString()) {
      this.validate(nextProps.dateFormat.formatString, nextProps.dates);
    }
  }

  componentDidUpdate() {
    if (this.props.dateFormat.enabled) {
      this.node.querySelector('[name="formatString"]').focus();
    }
  }

  toggleFormatter = (evt) => {
    evt.preventDefault();
    this.props.dispatch(actionTrigger(RECEIVE_DATE_FORMAT, {
      enabled: !this.props.dateFormat.enabled,
    }));
  };

  handleChange = (fieldProps, newValue) => {
    this.validate(newValue, this.props.dates);
  };

  validate = (formatString, dates) => {
    const testResult = dateUtils.disproveList(formatString, dates);
    this.props.dispatch(actionTrigger(RECEIVE_DATE_FORMAT, {
      validated: !testResult,
      failedAt: testResult,
      formatString,
    }));
  };

  render() {
    const containerClass =
      `${styles.optionsContainer} ${styles.dateFormatterContainer}`;
    return (
      <div
        className={containerClass}
        ref={(node) => {
          this.node = node;
        }}
      >
        <Switch
          checked={this.props.dateFormat.enabled}
          onClick={this.toggleFormatter}
        />
        <Label>{!this.props.dateFormat.enabled ?
          'Use date formatting?' :
          ''
        }</Label>
        {!this.props.dateFormat.enabled ? null : (
          <DispatchField
            handler={this.handleChange}
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

export default connect()(DateFormatter);
