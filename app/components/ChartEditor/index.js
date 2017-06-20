import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'rebass';
import AppComponent from '../Layout/AppComponent';
import Chart from '../Chart/';
import ChartDataFormatter from '../ChartDataFormatter';
import ChartSettings from '../ChartSettings';
import ChartTypeSelector from '../ChartTypeSelector';
import ChartLayout from '../ChartLayout';
import appSteps from '../../constants/appSteps';
import * as styles from './ChartEditor.css';

export default class ChartEditor extends AppComponent {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.displayChart = this.displayChart.bind(this);
    this.state = {};
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  updateDimensions() {
    const appComponent = document.querySelector('[class*=appComponent]');
    const subCompWidth =
      document.querySelector('[class*=subcomponentContainer]').clientWidth;
    const offsetLeft = appComponent.offsetLeft;
    const width = appComponent.clientWidth - subCompWidth;
    const left = subCompWidth + offsetLeft + 20;

    this.setState({ width, left });
  }

  renderSubcomponent(step) {
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
  displayChart(state) {
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
            {this.renderSubcomponent(this.props.appState.currentStep)}
          </div>
          {this.displayChart(this.props.appState)}
        </div>
      </div>
    );
  }
}

ChartEditor.propTypes = {
  appState: PropTypes.object,
};
