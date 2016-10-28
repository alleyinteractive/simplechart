// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { AppContainer } from 'react-hot-loader';

// Middleware
import thunk from 'redux-thunk';
import rawDataMiddleware from './middleware/rawDataMiddleware';
import unsavedChanges from './middleware/unsavedChanges';
import applyChartData from './middleware/applyChartData';
import applyChartTypeDefaults from './middleware/applyChartTypeDefaults';

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
    applyChartData,
    applyChartTypeDefaults,
    unsavedChanges,
  )
));

store.dispatch(bootstrapAppData());

const appEl = document.getElementById('app');
ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  appEl
);

if (module.hot) {
  // Make reducers hot reloadable
  module.hot.accept('./reducers/rootReducer', () => {
    const nextRootReducer = require('./reducers/rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });

  // Make components hot reloadable
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContainer>,
      appEl
    );
  });
}

sendMessage('appReady');
