import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appComponent } from '../../css/components.css';
import { dataTransformers } from '../../constants/dataTransformers';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._testChartTypes = this._testChartTypes.bind(this);
  }

  componentWillMount() {
    this._testChartTypes();
  }

  componentWillReceiveProps() {
    this._testChartTypes();
  }

  _testChartTypes() {
    const types = Object.keys(dataTransformers);
    types.forEach((type) =>
      this.setState({
        [type]: dataTransformers[type](this.props.data, this.props.fields),
      })
    );
  }

  render() {
    return (
      <div className={appComponent}>
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
