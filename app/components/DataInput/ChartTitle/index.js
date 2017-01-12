import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RECEIVE_CHART_METADATA } from '../../../constants';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';

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
      <div>
        <DispatchField
          action={RECEIVE_CHART_METADATA}
          fieldType="Input"
          fieldProps={{
            label: 'Chart title',
            name: 'metadata-title',
            value: this.state.title,
            style: { maxWidth: '500px' },
          }}
          handler={this._handleInput}
        />
        <HelpTrigger docName="chartTitle" />
      </div>
    );
  }
}

ChartTitle.propTypes = {
  metadata: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartTitle);
