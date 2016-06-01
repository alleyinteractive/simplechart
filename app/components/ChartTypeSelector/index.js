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

  /**
   * @todo Why does this take 2 clicks?
   */
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
        <h3>Available Chart Types</h3>
        <ul>
        {Object.keys(this.state).map((type) =>
          !this.state[type] ?
            (<li key={type}>{type}</li>) :
            (<li><a
              href="#0"
              onClick={this._handleClick}
              key={type}
              data-type={type}
            >{type}</a></li>)
          )
        }
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
