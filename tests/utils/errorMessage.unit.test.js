/* global describe test expect it jest */

import React from 'react';
import { render } from 'enzyme';
import ErrorMessage from '../../app/components/Header/ErrorMessage';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../app/reducers/rootReducer';

// Enzyme render
describe('Basic <ErrorMessage /> rendered', () => {
  const store = createStore(rootReducer);
  const wrapperRender = render(
    <Provider store={store}>
      <ErrorMessage code="e002">{false}</ErrorMessage>
    </Provider>
  );

  it('should match the error code test', () => {
    expect(wrapperRender.text()).toContain('Data field is empty.');
  });
});
