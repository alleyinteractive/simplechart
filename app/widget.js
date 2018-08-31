// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import 'styles/nv.d3.css';

import actionTrigger, { ajaxWidgetData, listenerWidgetData } from './actions';
import { RECEIVE_WIDGET } from './constants';
import Widget from './components/Widget';
import rootReducer from './reducers/widget/rootReducer';
import getPublicPath from './utils/getPublicPath';

// Set public path for loading chunks and other assets
__webpack_public_path__ = __webpack_public_path__ || getPublicPath(); // eslint-disable-line camelcase,no-undef

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk)
));

// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
  module.hot.accept('./reducers/widget/rootReducer', () => {
    const nextRootReducer = require('./reducers/widget/rootReducer').default; // eslint-disable-line global-require
    store.replaceReducer(nextRootReducer);
  });
}

// Initialize and render each widget on the page
function initWidgets() {
  const widgets = document.querySelectorAll('.simplechart-widget');
  if (widgets.length) {
    for (let i = 0; i < widgets.length; i += 1) {
      renderWidget(widgets[i]);
    }
  }
}

function renderWidget(el) {
  /**
   * Requires one of two possible attributes to get the data it needs
   * 1. data-url="{URL}" will make an AJAX request to get the data from the URL
   * 2. data-var will safely look for data in window._SimplechartWidgetData global
   *   then listen for the 'widgetData' event to be triggered on the widget element
   */
  if (el.getAttribute('data-url')) {
    // Data from API
    store.dispatch(
      ajaxWidgetData(
        el.id,
        el.getAttribute('data-url'),
        el.getAttribute('data-headers')
      )
    );
  } else if (el.hasAttribute('data-var')) {
    // Data from global variable if available
    const widgetData = window._SimplechartWidgetData; // eslint-disable-line no-underscore-dangle
    if (widgetData && widgetData[el.id]) {
      store.dispatch(actionTrigger(RECEIVE_WIDGET, {
        widget: el.id,
        data: widgetData[el.id],
      }));
    }
  } else {
    // Must have either data-url or data-var
    return;
  }

  // And listen for 'widgetData' event triggered on widget element
  listenerWidgetData(el, store.dispatch);

  /**
   * @todo change Widget props to like data={state[el.id]}
   */
  const chartContainer = el.querySelectorAll('.simplechart-chart');
  if (chartContainer.length) {
    ReactDOM.render(
      <Provider store={store}>
        <Widget
          widget={el.id}
          placeholder={el.getAttribute('data-placeholder') || ''}
        />
      </Provider>,
      chartContainer[0]
    );
  }
}

// Wait until DOMContentLoaded before initializing widgets
if ('loading' === document.readystate) {
  document.addEventListener('DOMContentLoaded', initWidgets);
} else {
  // Or initialize now if event has already fired
  initWidgets();
}
