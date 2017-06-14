import pick from 'lodash/fp/pick';
import { createSelector } from 'reselect';

const checkDataValid = createSelector(
  (state) => state.dataStatus.status,
  (state) => state.dateFormat,
  (status, dateFormat = {}) => {
    // Check for valid data input
    // Errors w/ invalid data would have already surfaced in rawDataMiddleware
    const dataSuccess = !!(status && 'success' === status);

    // Date formatting should be disabled or validated
    const dateFormatSuccess = !dateFormat.enabled || dateFormat.validated;

    // return value indicates if we can proceed to next step
    return dataSuccess && dateFormatSuccess;
  }
);

const checkChartTypeSelected = ({ chartType }) =>
  Boolean(chartType.config && chartType.defaultOpts);

export const getIsNextStepAvailable = createSelector(
  (state) => state.currentStep,
  checkDataValid,
  checkChartTypeSelected,
  (step, isDataValid, isChartTypeSelected) => {
    switch (step) {
      case 0:
        return isDataValid;

      case 1:
        return isChartTypeSelected;

      default:
        return true;
    }
  }
);

export const getSaveData = (state) => {
  // Pluck from state only the keys we want to eventually save to the CMS
  const properties = [
    'rawData',
    'chartData',
    'chartMetadata',
    'chartOptions',
    'googleSheetId',
  ];

  return Object.assign(pick(properties, state), {
    chartType: state.chartType.config ? state.chartType.config.type : '',
  });
};
