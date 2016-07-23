import React, { Component } from 'react';
import ErrorMessage from '../../utils/ErrorMessage';
import PieChartOptions from '../Chart/ChartTypes/PieChart/PieChartOptions';

export default class ChartOptions extends Component {

  constructor() {
    super();
    this._chartTypeOptions = this._chartTypeOptions.bind(this);
  }
  componentWillMount() {
    this.setState(this.props.options);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.options);
  }

  _chartTypeOptions() {
    let optionsComponent;
    switch (this.props.options.type) {
      case 'pieChart':
        optionsComponent = React.createElement(
            PieChartOptions, this.props);
        break;

      default:
        optionsComponent = new ErrorMessage();
    }
    return optionsComponent;
  }

  render() {
    return (
      <div>
        {this._chartTypeOptions()}
        <pre>
          {JSON.stringify(this.props.options, null, '  ')}
        </pre>
      </div>
    );
  }
}

ChartOptions.propTypes = {
  options: React.PropTypes.object,
};
