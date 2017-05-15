import { createSelector } from 'reselect';

export const getIsNextStepAvailable = createSelector(
  (state) => state.dataStatus.status,
  (state) => state.dataFormat,
  (status, dateFormat) => {
    // Check for valid data input
    // Errors w/ invalid data would have already surfaced in rawDataMiddleware
    const dataSuccess = 'success' === status;

    // Date formatting should be disabled or validated
    const dateFormatSuccess = !dateFormat.enabled || dateFormat.validated;

    // return value indicates if we can proceed to next step
    return dataSuccess && dateFormatSuccess;
  }
);
