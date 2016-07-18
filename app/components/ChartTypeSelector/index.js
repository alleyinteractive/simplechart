import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataTransformers } from '../../constants/dataTransformers';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_DATA } from '../../constants';
import actionTrigger from '../../actions';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._testChartTypes = this._testChartTypes.bind(this);
    this._selectChartType = this._selectChartType.bind(this);
  }

  componentWillMount() {
    this._testChartTypes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._testChartTypes(nextProps);
  }

  _selectChartType(evt) {
    const type = evt.target.getAttribute('data-type');

    // send selected chart type  to store options
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS,
      { type }
    ));

    // send data to store, already transformed for selected chart type
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      this.state[type]
    ));
  }

  _testChartTypes(props) {
    const types = Object.keys(dataTransformers);
    types.forEach((type) =>
      this.setState({
        [type]: dataTransformers[type](props.data, props.fields),
      })
    );
  }

  render() {
    return (
      <div>
        <h3>Available Chart Types</h3>
        <ul>
        {Object.keys(this.state).map((type) =>
          /**
           * This will be its own component soon.
           * The idea is to enable chart types where data is compatible
           * and disable chart types where data is incompatible
           */
          !this.state[type] ?
            (<li key={type}>{type}</li>) :
            (<li key={type}><a
              href="#0"
              onClick={this._selectChartType}
              data-type={type}
            >{type}</a></li>)
        )}
        </ul>
      </div>
    );
  }
}

ChartTypeSelector.propTypes = {
  data: React.PropTypes.array,
  fields: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartTypeSelector);
