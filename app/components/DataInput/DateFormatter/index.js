import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as styles from '../DataInput.css';
import { Switch, Label } from 'rebass';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import { RECEIVE_CHART_OPTIONS } from '../../../constants';
import * as dateUtils from '../../../utils/parseDate';
import { Text } from 'rebass';

class DateFormatter extends Component {
  constructor() {
    super();
    this._toggleFormatter = this._toggleFormatter.bind(this);
    this._testFormatString = this._testFormatString.bind(this);
    this.state = {
      formatterIsOpen: false,
    };
  }

  componentDidUpdate() {
    if (this.state.formatterIsOpen) {
      ReactDOM.findDOMNode(this)
        .querySelector('[name="dateFormatString"]')
        .focus();
    }
  }

  _toggleFormatter(evt) {
    evt.preventDefault();
    this.setState({
      formatterIsOpen: !this.state.formatterIsOpen,
    });
  }

  _testFormatString() {
    if (!this.props.dateFormatString) {
      return null;
    }

    // @todo Return null or dateString that failed instead of boolean
    const failedDate = this.props.dates.reduce((acc, dateString) => {
      if (acc) {
        return acc;
      }
      return dateUtils.validate(dateString, this.props.dateFormatString) ?
        null : dateString;
    }, null);

    return (
      <span className={styles[failedDate ? 'error' : 'success']}>
        <Text small>{failedDate ?
          `Invalid date format for ${failedDate}` : 'Date format validated'}
        </Text>
      </span>
    );
  }

  render() {
    const containerClass =
      `${styles.optionsContainer} ${styles.dateFormatterContainer}`;

    return (
      <div className={containerClass}>
        <Switch
          checked={this.state.formatterIsOpen}
          onClick={this._toggleFormatter}
        />
        <Label>{!this.state.formatterIsOpen ?
          'Use date formatting?' :
          'Enter date format'
        }</Label>
        <HelpTrigger docName="dateFormatter" />
        {!this.state.formatterIsOpen ? null : (
          <DispatchField
            action={RECEIVE_CHART_OPTIONS}
            fieldType="Input"
            fieldProps={{
              hideLabel: true,
              placeholder: 'e.g. MM/DD/YYYY for 06/25/2014',
              name: 'dateFormatString',
              style: { marginBottom: '0px', width: '300px' },
              value: this.props.dateFormatString,
            }}
          />
        )}
        {!this.state.formatterIsOpen ? null : this._testFormatString()}
      </div>
    );
  }
}

DateFormatter.propTypes = {
  dateFormatString: React.PropTypes.string,
  dates: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

export default connect()(DateFormatter);
