// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

// Middleware
import thunk from 'redux-thunk';
import rawDataMiddleware
  from './middleware/rawDataMiddleware';
import chartOptionsInitMiddleware
  from './middleware/chartOptionsInitMiddleware';
import unsavedChangesMiddleware
  from './middleware/unsavedChangesMiddleware';
import applyColorsMiddleware
  from './middleware/applyColorsMiddleware';

// Other stuff
import { bootstrapAppData } from './actions';
import App from './components/App';
import { sendMessage } from './utils/postMessage';
import * as NVD3Styles from 'style!raw!nvd3/build/nv.d3.css'; // eslint-disable-line no-unused-vars

// Create the store with redux-thunk middleware, which allows us to
// do asyncronous things in the actions
import rootReducer from './reducers/rootReducer';
const store = createStore(rootReducer, compose(
  applyMiddleware(
    thunk,
    rawDataMiddleware,
    chartOptionsInitMiddleware,
    unsavedChangesMiddleware,
    applyColorsMiddleware
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

store.dispatch(bootstrapAppData());

// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
  module.hot.accept('./reducers/rootReducer', () => {
    const nextRootReducer = require('./reducers/rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

sendMessage('appReady');
