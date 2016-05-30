// Import third party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { bootstrapData } from './actions';
import Widget from './components/Widget';

// Create the store with redux-thunk middleware, which allows us to
// do asyncronous things in the actions
import rootReducer from './reducers/rootReducer';
const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
  module.hot.accept('./reducers/rootReducer', () => {
    const nextRootReducer = require('./reducers/rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

// Render each widget on the page
const widgets = document.querySelectorAll('.simplechart-widget');
if (widgets.length) {
  for (let i = 0; i < widgets.length; ++i) {
    store.dispatch(
      bootstrapData(widgets[i].id, widgets[i].getAttribute('data-url'))
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
