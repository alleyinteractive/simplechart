import React from 'react';
import { connect } from 'react-redux';
import Chart from '../Chart/';
import ChartTypeSelector from '../ChartTypeSelector/';
import ChartMetadata from '../ChartMetadata/';
import PalettePicker from '../PalettePicker/';
import AppComponent from '../Layout/AppComponent';
import ErrorMessage from '../../utils/ErrorMessage';
import { Heading } from 'rebass';
import { appSteps } from '../../constants/appSteps';
import * as styles from './ChartBuilder.css';

class ChartBuilder extends AppComponent {

  _renderSubcomponent(step) {
    let subcomponent;
    switch (step) {
      case 1:
        subcomponent = React.createElement(ChartTypeSelector, {
          data: this.props.state.parsedData,
          fields: this.props.state.dataFields,
          type: this.props.state.chartOptions.type || '',
        });
        break;

      case 2:
        subcomponent = React.createElement(ChartMetadata, {
          metadata: this.props.state.chartMetadata,
        });
        break;

      case 3:
        subcomponent = React.createElement(PalettePicker, {
          data: this.props.state.chartData,
          options: this.props.state.chartOptions,
        });
        break;

      default:
        subcomponent = new ErrorMessage();
    }
    return subcomponent;
  }

  render() {
    return (
      <div className={this.parentStyles.appComponent}>
        <Heading level={2}>{appSteps[this.props.state.currentStep]}</Heading>
        <div className={styles.builderContainer}>
          <div className={styles.subcomponentContainer}>
            {this._renderSubcomponent(this.props.state.currentStep)}
          </div>
          <div className={styles.chartContainer}>
            <Chart
              data={this.props.state.chartData}
              options={this.props.state.chartOptions}
              metadata={this.props.state.chartMetadata}
            />
          </div>
        </div>
      </div>
    );
  }
}

ChartBuilder.propTypes = {
  state: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection
export default connect()(ChartBuilder);
