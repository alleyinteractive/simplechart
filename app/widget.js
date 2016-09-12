// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import actionTrigger, { ajaxWidgetData, listenerWidgetData } from './actions';
import { RECEIVE_WIDGET } from './constants';
import Widget from './components/Widget';
import * as NVD3Styles from 'style!raw!nvd3/build/nv.d3.css'; // eslint-disable-line no-unused-vars

// Create the store with redux-thunk middleware, which allows us to
// do asyncronous things in the actions
import rootReducer from './reducers/widget/rootReducer';
const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
  module.hot.accept('./reducers/widget/rootReducer', () => {
    const nextRootReducer = require('./reducers/widget/rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

// Initialize and render each widget on the page
function initWidgets() {
  const widgets = document.querySelectorAll('.simplechart-widget');
  if (widgets.length) {
    for (let i = 0; i < widgets.length; ++i) {
      renderWidget(widgets[i]);
    }
  }
}

function renderWidget(el) {
  if (el.getAttribute('data-url')) {
    // Data from API
    store.dispatch(
      ajaxWidgetData(
        el.id,
        el.getAttribute('data-url'),
        el.getAttribute('data-headers')
      )
    );
  } else if (el.getAttribute('data-var')) {
    // Data from global variable if available
    if (window._SimplechartWidgetData &&
      window._SimplechartWidgetData[el.getAttribute('data-var')]) {
      store.dispatch(actionTrigger(RECEIVE_WIDGET, {
        widget: el.id,
        data: window._SimplechartWidgetData[el.getAttribute('data-var')],
      }));
    }

    listenerWidgetData(el, store);
  } else {
    // Bye.
    return;
  }

  /**
   * @todo change Widget props to like data={state[el.id]}
   */
  const chartContainer = el.querySelectorAll('.simplechart-chart');
  if (chartContainer.length) {
    ReactDOM.render(
      <Provider store={store}>
        <Widget widget={el.id} />
      </Provider>,
      chartContainer[0]
    );
  }
}

// Wait until DOMContentLoaded before initializing widgets
if (document.readystate === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidgets);
} else {
  // Or initialize now if event has already fired
  initWidgets();
}
