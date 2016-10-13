import React from 'react';
import Chart from '../Chart/';
import ChartTypeSelector from '../ChartTypeSelector/';
import ChartDataFormatter from '../ChartDataFormatter';
import ChartMetadata from '../ChartMetadata/';
import PalettePicker from '../PalettePicker/';
import ChartOptions from '../ChartOptions/';
import AppComponent from '../Layout/AppComponent';
import ErrorMessage from '../../utils/ErrorMessage';
import { Heading } from 'rebass';
import { appSteps } from '../../constants/appSteps';
import * as styles from './ChartEditor.css';

export default class ChartEditor extends AppComponent {

  _renderSubcomponent(step) {
    let subcomponent;
    switch (step) {
      case 1:
        subcomponent = React.createElement(ChartTypeSelector, {
          transformedData: this.props.state.transformedData,
          fields: this.props.state.dataFields,
          type: this.props.state.chartOptions.type || '',
        });
        break;

      case 2:
        subcomponent = React.createElement(ChartDataFormatter, {
          data: this.props.state.chartData,
          options: this.props.state.chartOptions,
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
            {this.props.state.chartOptions.type ?
              (<h3>{this.props.state.chartMetadata.title}</h3>) : ''
            }
            <Chart
              data={this.props.state.chartData}
              options={this.props.state.chartOptions}
              widget={false}
              ref="chartComponent"
            />
            {this.props.state.chartOptions.type ?
              (<p>{this.props.state.chartMetadata.caption}</p>) : ''
            }
            {this.props.state.chartOptions.type ?
              (<p className={styles.credit}>
                {this.props.state.chartMetadata.credit}
              </p>) : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

ChartEditor.propTypes = {
  state: React.PropTypes.object,
};
