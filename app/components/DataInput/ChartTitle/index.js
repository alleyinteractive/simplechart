import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RECEIVE_CHART_METADATA } from '../../../constants';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import * as styles from './ChartTitle.css';

class ChartTitle extends Component {
  constructor() {
    super();
    this._handleInput = this._handleInput.bind(this);
  }

  componentWillMount() {
    this.setState({ title: this.props.metadata.title || '' });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.metadata.title || '' });
  }

  _handleInput(fieldProps, value) {
    return {
      title: value,
      caption: this.props.metadata.caption || '',
      credit: this.props.metadata.credit || '',
    };
  }

  render() {
    return (
      <div className={styles.container} >
        <DispatchField
          action={RECEIVE_CHART_METADATA}
          fieldType="Input"
          fieldProps={{
            label: 'Chart title',
            name: 'metadata-title',
            value: this.state.title,
            style: { marginBottom: '0px' }, // override default Rebass style
          }}
          handler={this._handleInput}
        />
        <HelpTrigger docName="chartMetadata" />
      </div>
    );
  }
}

ChartTitle.propTypes = {
  metadata: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(ChartTitle);
