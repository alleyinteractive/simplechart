import React from 'react';
import AppComponent from '../Layout/AppComponent';
import Chart from '../Chart/';
import ChartDataFormatter from '../ChartDataFormatter';
import ChartSettings from '../ChartSettings';
import ChartTypeSelector from '../ChartTypeSelector/';
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
          transformedData: this.props.appState.transformedData,
          typeObj: this.props.appState.chartType,
        });
        break;

      case 2:
        subcomponent = React.createElement(ChartSettings, {
          options: this.props.appState.chartOptions,
          metadata: this.props.appState.chartMetadata,
          data: this.props.appState.chartData,
          typeConfig: this.props.appState.chartType.config,
        });
        break;

      case 3:
        subcomponent = React.createElement(ChartDataFormatter, {
          options: this.props.appState.chartOptions,
        });
        break;

      // case 4:
      //   subcomponent = React.createElement(PalettePicker, {
      //     data: this.props.appState.chartData,
      //     options: this.props.appState.chartOptions,
      //   });
      //   break;

      // case 5:
      //   subcomponent = React.createElement(ChartOptions, {
      //     options: this.props.appState.chartOptions,
      //     chart: this.refs.chartComponent,
      //   });
      //   break;
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
        <Heading level={2}>{appSteps[this.props.appState.currentStep]}</Heading>
        <div className={styles.builderContainer}>
          <div className={styles.subcomponentContainer}>
            {this._renderSubcomponent(this.props.appState.currentStep)}
          </div>
          {this._displayChart(this.props.appState)}
        </div>
      </div>
    );
  }
}

ChartEditor.propTypes = {
  appState: React.PropTypes.object,
};
