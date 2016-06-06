import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RECEIVE_CHART_METADATA } from '../../constants';
import actionTrigger from '../../actions';
import update from 'react-addons-update';

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
    // overwrite component state with newly received props after store is updated
    // but allow empty state to serve as default on initial render when props metadata is empty
    const values = update(this.state, { $merge: this.props.metadata });
    return (
      <div>
        {Object.keys(values).map((key) =>
          (<div key={key}>
            <label htmlFor={key} >
              {this.labels[key]}
              <input
                name={key}
                onChange={this._updateState}
                onBlur={this._submitField}
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
