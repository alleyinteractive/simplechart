import React from 'react';
import Chart from '../Chart/';
import ChartTypeSelector from '../ChartTypeSelector/';
import ChartSettings from '../ChartSettings';
import ChartMetadata from '../ChartMetadata/';
import PalettePicker from '../PalettePicker/';
import ChartOptions from '../ChartOptions/';
import AppComponent from '../Layout/AppComponent';
import { Heading } from 'rebass';
import { appSteps } from '../../constants/appSteps';
import * as styles from './ChartEditor.css';

export default class ChartEditor extends AppComponent {

  _renderSubcomponent(step) {
    let subcomponent;
    switch (step) {
      case 1:
      default:
        subcomponent = React.createElement(ChartTypeSelector, {
          transformedData: this.props.state.transformedData,
          typeObj: this.props.state.chartType,
        });
        break;

      case 2:
        subcomponent = React.createElement(ChartSettings, {
          data: this.props.state.chartData,
          options: this.props.state.chartOptions,
          typeConfig: this.props.state.chartType.config,
          currentStep: this.props.state.currentStep,
        });
        break;

      case 3:
        subcomponent = React.createElement(ChartMetadata, {
          metadata: this.props.state.chartMetadata,
        });
        break;

      case 4:
        subcomponent = React.createElement(PalettePicker, {
          data: this.props.state.chartData,
          options: this.props.state.chartOptions,
        });
        break;

      case 5:
        subcomponent = React.createElement(ChartOptions, {
          options: this.props.state.chartOptions,
          chart: this.refs.chartComponent,
        });
        break;
    }
    return subcomponent;
  }

  /**
   * Once a chart type has been selected, we can begin showing the chart
   */
  _displayChart(state) {
    if (!state.chartOptions.type) {
      return null;
    }
    return (
      <div className={styles.chartContainer}>
        <h3>{state.chartMetadata.title}</h3>
        <Chart
          data={state.chartData}
          options={state.chartOptions}
          widget={false}
          ref="chartComponent"
        />
        <p>{state.chartMetadata.caption}</p>
        <p className={styles.credit}>
          {state.chartMetadata.credit}
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className={this.parentStyles.appComponent}>
        <Heading level={2}>{appSteps[this.props.state.currentStep]}</Heading>
        <div className={styles.builderContainer}>
          <div className={styles.subcomponentContainer}>
            {this._renderSubcomponent(this.props.state.currentStep)}
          </div>
          {this._displayChart(this.props.state)}
        </div>
      </div>
    );
  }
}

ChartEditor.propTypes = {
  state: React.PropTypes.object,
};
