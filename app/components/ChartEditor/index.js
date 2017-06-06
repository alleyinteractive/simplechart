import React from 'react';
import AppComponent from '../Layout/AppComponent';
import Chart from '../Chart/';
import ChartDataFormatter from '../ChartDataFormatter';
import ChartSettings from '../ChartSettings';
import ChartTypeSelector from '../ChartTypeSelector';
import ChartLayout from '../ChartLayout';
import { Heading } from 'rebass';
import { appSteps } from '../../constants/appSteps';
import * as styles from './ChartEditor.css';

export default class ChartEditor extends AppComponent {
  constructor() {
    super();
    this._updateDimensions = this._updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._updateDimensions);
    this._updateDimensions();
  }

  _updateDimensions() {
    const subCompWidth =
      document.querySelector('[class*=subcomponentContainer]').clientWidth;
    const offsetLeft = document.querySelector('[class*=appComponent]').offsetLeft;
    const width =
      document.querySelector('[class*=appComponent]').clientWidth -
        subCompWidth;
    const left = subCompWidth + offsetLeft + 20;

    this.setState({ width, left });
  }

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

      case 4:
        subcomponent = React.createElement(ChartLayout, {
          options: this.props.appState.chartOptions,
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

    const { width, left } = this.state;

    return (
      <div className={styles.chartContainer} style={{ width, left }}>
        <h3>{state.chartMetadata.title}</h3>
        <Chart
          data={state.chartData}
          options={state.chartOptions}
          widget={false}
          ref="chartComponent"
          rulers={4 === state.currentStep}
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
