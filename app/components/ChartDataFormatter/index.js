import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { locales } from '../../constants/d3Locales';
import { RECEIVE_TICK_FORMAT } from '../../constants';
import DispatchField from '../lib/DispatchField';
import {
  defaultTickFormatSettings,
  multiplierOptions,
  formatScopes,
} from '../../constants/defaultTickFormatSettings';
import FormatScopeSelect from './FormatScopeSelect';

const defaultFormatScope = 'all';

/**
 * For each available format settings scope (axes, tooltip, etc)
 * merge received tickFormatSettings into default settings.
 * Look for scope-specific options with fallback
 * to legacy format that had only one set of options
 *
 * @TODO Move this logic into mapStateToProps()
 *
 * @param {Object} settings Received settings object
 * @return {Object} Options per scope
 */
function mergePropsIntoDefaults(settings) {
  return formatScopes.reduce((acc, { name }) => {
    const scopeSettings = ('undefined' !== typeof settings) ?
      (settings[name] || settings) : {};
    acc[name] = update(defaultTickFormatSettings, { $merge: scopeSettings });
    return acc;
  }, {});
}

class ChartDataFormatter extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    dataFormat: PropTypes.string.isRequired,
  };

  static localeOptions() {
    return locales.map((locale, idx) => ({
      children: `${locale.emoji} ${locale.name}`,
      value: idx,
    }));
  }

  componentWillMount() {
    const initState = mergePropsIntoDefaults(
      this.props.options.tickFormatSettings);

    initState.formatScope = defaultFormatScope;
    this.setState(initState);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      mergePropsIntoDefaults(nextProps.options.tickFormatSettings)
    );
  }

  setFormatScope = (formatScope) => {
    this.setState({ formatScope });
  }

  /**
   * Return full tickFormatSettings object after any element is changed
   */
  handleChange = (fieldProps, value) => {
    const field = fieldProps.name.split('.').pop();
    return {
      tickFormatSettings: update(this.state, { [field]: { $set: value } }),
    };
  }

  render() {
    const getScopeProperty =
      (key) => this.state[this.state.formatScope][key];
    const getFieldName =
      (key) => `${this.state.formatScope}.${key}`;

    return (
      <div>
        <div>
          {'nvd3SingleSeries' !== this.props.dataFormat && (
            <FormatScopeSelect
              buttonOpts={formatScopes}
              value={this.state.formatScope}
              handler={this.setFormatScope}
            />
          )}

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Select"
            fieldProps={{
              label: 'Format currency and thousands separator as:',
              options: ChartDataFormatter.localeOptions(),
              name: getFieldName('locale'),
              value: getScopeProperty('locale'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Show currency symbol?',
              name: getFieldName('showCurrencySymbol'),
              checked: getScopeProperty('showCurrencySymbol'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Use thousands separator',
              name: getFieldName('groupThousands'),
              checked: getScopeProperty('groupThousands'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Display as percentage',
              name: getFieldName('usePercent'),
              checked: getScopeProperty('usePercent'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Input"
            fieldProps={{
              label: 'Leading text',
              name: getFieldName('prepend'),
              value: getScopeProperty('prepend'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Input"
            fieldProps={{
              label: 'Trailing text',
              name: getFieldName('append'),
              value: getScopeProperty('append'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Input"
            fieldProps={{
              label: 'Decimal places',
              type: 'number',
              step: 1,
              min: 0,
              name: getFieldName('decimalPlaces'),
              value: getScopeProperty('decimalPlaces'),
            }}
          />

          <DispatchField
            action={RECEIVE_TICK_FORMAT}
            fieldType="Select"
            fieldProps={{
              label: 'Multiply/divide values',
              options: multiplierOptions,
              name: getFieldName('multiplier'),
              value: getScopeProperty('multiplier'),
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

const mapStateToProps = ({ chartType }) => ({
  dataFormat: chartType.config.dataFormat || '',
});

export default connect(mapStateToProps)(ChartDataFormatter);
