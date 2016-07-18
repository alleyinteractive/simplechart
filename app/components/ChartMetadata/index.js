import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RECEIVE_CHART_METADATA } from '../../constants';
import actionTrigger from '../../actions';

class ChartMetadata extends Component {
  constructor() {
    super();
    this._submitField = this._submitField.bind(this);
    this._updateState = this._updateState.bind(this);
    this.state = {
      title: '',
      caption: '',
      credit: '',
    };
    this.labels = {
      title: 'Title',
      caption: 'Caption',
      credit: 'Credit',
    };
  }

  componentWillMount() {
    this.setState(this.props.metadata);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.metadata);
  }

  _updateState(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  _submitField() {
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_METADATA,
      this.state
    ));
  }

  render() {
    return (
      <div>
        {Object.keys(this.state).map((key) =>
          (<div key={key}>
            <label htmlFor={key} >
              {this.labels[key]}
              <input
                name={key}
                onChange={this._updateState}
                onBlur={this._submitField}
                value={this.state[key]}
              />
            </label>
          </div>)
        )}
      </div>
    );
  }
}

ChartMetadata.propTypes = {
  metadata: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartMetadata);
