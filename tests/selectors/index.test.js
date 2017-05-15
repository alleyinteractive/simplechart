import { getIsNextStepAvailable } from '../../app/selectors';

const validState = {
  currentStep: 0,
  dataStatus: {
    status: 'success',
  },
  dataFormat: {
    enabled: true,
    validated: true,
  },
  chartType: {
    config: {},
    defaultOpts: {},
  },
};

describe('getIsNextStepAvailable', () => {
  test('checks valid data input step', () => {
    expect(getIsNextStepAvailable(validState)).toBe(true);
  });

  test('checks invalid data input step', () => {
    const state = Object.assign({}, validState, {
      dataStatus: {
        status: 'failure',
      },
    });

    expect(getIsNextStepAvailable(state)).toBe(false);
  });

  test('checks chart type selection step', () => {
    const state = Object.assign({}, validState, { currentStep: 1 });
    expect(getIsNextStepAvailable(state)).toBe(true);
  });

  test('checks invalid chart type selection step', () => {
    const state = Object.assign({}, validState, {
      currentStep: 1,
      chartType: {},
    });

    expect(getIsNextStepAvailable(state)).toBe(false);
  });
});
