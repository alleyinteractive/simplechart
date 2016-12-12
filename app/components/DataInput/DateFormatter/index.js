import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as styles from '../DataInput.css';
import { Switch, Label } from 'rebass';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import { RECEIVE_CHART_OPTIONS } from '../../../constants';
import * as dateUtils from '../../../utils/parseDate';

class DateFormatter extends Component {
  constructor() {
    super();
    this._toggleFormatter = this._toggleFormatter.bind(this);
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

  render() {
    return (
      <div className={styles.optionsContainer}>
        <Label>{!this.state.formatterIsOpen ?
          'Use date formatting?' :
          'Enter date format'
        }</Label>
        <HelpTrigger docName="dateFormatter" />
        <Switch
          checked={this.state.formatterIsOpen}
          onClick={this._toggleFormatter}
        />
        {!this.state.formatterIsOpen ? null : (
          <DispatchField
            action={RECEIVE_CHART_OPTIONS}
            fieldType="Input"
            fieldProps={{
              label: 'e.g. MM/DD/YYYY for 06/25/2014',
              name: 'dateFormatString',
              style: { marginBottom: '0px' },
            }}
          />
        )}
      </div>
    );
  }
}

DateFormatter.propTypes = {
  dateFormatString: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(DateFormatter);
