/* global describe test expect it jest */

import React from 'react';
import { render } from 'enzyme';
import Header from '../../../app/components/Header';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../../app/reducers/rootReducer';

// Enzyme render
describe('Basic <Header /> rendered', () => {
  const store = createStore(rootReducer);
  const wrapperRender = render(
    <Provider store={store}>
      <Header errorCode="e002">{false}</Header>
    </Provider>
  );

  it('should match the error code test', () => {
    expect(wrapperRender.text()).toContain('Data field is empty.');
  });
});
