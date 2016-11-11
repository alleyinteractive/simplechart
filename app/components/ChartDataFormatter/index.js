import React, { Component } from 'react';
import { connect } from 'react-redux';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { locales } from '../../constants/d3Locales';
import { RECEIVE_CHART_OPTIONS_EXTEND } from '../../constants';
import DispatchField from '../lib/DispatchField';
import {
  defaultTickFormatSettings,
  multiplierOptions,
} from '../../constants/defaultTickFormatSettings';
import update from 'react-addons-update';

class ChartDataFormatter extends Component {
  componentWillMount() {
    this.setState(
      this._handleProps(this.props.options.tickFormatSettings || {})
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      this._handleProps(nextProps.options.tickFormatSettings || {})
    );
  }

  _handleProps(settings) {
    return update(defaultTickFormatSettings, { $merge: settings });
  }

  _localeOptions() {
    return locales.map((locale, idx) => ({
      children: `${locale.emoji} ${locale.name}`,
      value: idx,
    }));
  }

  render() {
    return (
      <div>
        <div>
          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Select"
            fieldProps={{
              label: 'Use country settings',
              name: 'tickFormatSettings.locale',
              options: this._localeOptions(),
              value: this.state.locale,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Use thousands separator',
              name: 'tickFormatSettings.groupThousands',
              checked: this.state.groupThousands,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Show currency symbol?',
              name: 'tickFormatSettings.showCurrencySymbol',
              checked: this.state.showCurrencySymbol,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Input"
            fieldProps={{
              label: 'Leading text',
              name: 'tickFormatSettings.prepend',
              checked: this.state.prepend,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Input"
            fieldProps={{
              label: 'Trailing text',
              name: 'tickFormatSettings.append',
              checked: this.state.append,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Input"
            fieldProps={{
              label: 'Decimal places',
              type: 'number',
              step: 1,
              min: 0,
              name: 'tickFormatSettings.decimalPlaces',
              checked: this.state.decimalPlaces,
            }}
          />

          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Select"
            fieldProps={{
              label: 'Multiply/divide values',
              name: 'tickFormatSettings.multiplier',
              options: multiplierOptions,
              value: this.state.multiplier,
            }}
          />

        </div>
        <NextPrevButton
          text="Next"
          currentStep={3}
          dir="next"
        />
      </div>
    );
  }
}

ChartDataFormatter.propTypes = {
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartDataFormatter);
