import React, { Component } from 'react';
import { connect } from 'react-redux';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { locales, defaultLocaleIndex } from '../../constants/d3Locales';
import { RECEIVE_CHART_OPTIONS } from '../../constants';
import DispatchField from '../lib/DispatchField';

class ChartDataFormatter extends Component {
  componentWillMount() {
    this.setState({
      revertTo: this.props.tickFormatSettings,
      settings: this.props.tickFormatSettings,
      currentLocale:
        this.props.tickFormatSettings.locale || defaultLocaleIndex,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      settings: nextProps.tickFormatSettings,
      currentLocale:
        nextProps.tickFormatSettings.locale || defaultLocaleIndex,
    });
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
            action={ RECEIVE_CHART_OPTIONS }
            fieldType="Select"
            fieldProps={{
              label: 'Locale',
              name: 'tickFormatSettings.locale',
              options: this._localeOptions(),
              value: parseInt(this.state.currentLocale),
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
  tickFormatSettings: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartDataFormatter);
