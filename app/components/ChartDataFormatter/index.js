import React, { Component } from 'react';
import { connect } from 'react-redux';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
// import { locales, defaultLocaleIndex } from '../../constants/d3Locales';
import { RECEIVE_CHART_OPTIONS_EXTEND } from '../../constants';
import DispatchField from '../lib/DispatchField';

class ChartDataFormatter extends Component {
  componentWillMount() {
    this.setState(this._handleProps(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._handleProps(nextProps));
  }

  _handleProps(props) {
    return {
      showCurrencySymbol: props.tickFormatSettings.showCurrencySymbol || false,
    };
  }

  // _localeOptions() {
  //   return locales.map((locale, idx) => ({
  //     children: `${locale.emoji} ${locale.name}`,
  //     value: idx,
  //   }));
  // }

  render() {
    return (
      <div>
        <div>
          <DispatchField
            action={RECEIVE_CHART_OPTIONS_EXTEND}
            fieldType="Checkbox"
            fieldProps={{
              label: 'Show currency symbol?',
              name: 'tickFormatSettings.showCurrencySymbol',
              checked: this.state.showCurrencySymbol,
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
