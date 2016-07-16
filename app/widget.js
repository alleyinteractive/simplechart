// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { bootstrapWidgetData } from './actions';
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
      store.dispatch(
        bootstrapWidgetData(widgets[i].id, widgets[i].getAttribute('data-url'))
      );
      /**
       * @todo change Widget props to like data={store[widgets[i].id]}
       * so every chart isn't re-rendered after each AJAX response
       */
      ReactDOM.render(
        <Provider store={store}>
          <Widget widget={widgets[i].id} />
        </Provider>,
        widgets[i]
      );
    }
  }
}

// Wait until DOMContentLoaded before initializing widgets
if (document.readystate === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidgets);
} else {
  // Or initialize now if event has already fired
  initWidgets();
}
