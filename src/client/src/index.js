import './styles/App.css';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { AppContainer } from 'react-hot-loader'; // remove if not using
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable';
import { createBrowserHistory } from 'history';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './containers/App';
import api from './middleware/api';
import rootReducer from './reducers';

injectTapEventPlugin();

const history = createBrowserHistory();
const initialState = Immutable.Map({});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const routerMiddlewareWithHistory = routerMiddleware(history);
const loggerMiddleware = createLogger();

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composeEnhancer(
    applyMiddleware(thunkMiddleware,
      api, 
      routerMiddlewareWithHistory,
      loggerMiddleware)
  )
);

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);

// Hot reloading
// if (module.hot) {
//   // Reload components
//   module.hot.accept('./containers/App', () => {
//     render()
//   })

//   // Reload reducers
//   module.hot.accept('./reducers', () => {
//     store.replaceReducer(connectRouter(history)(rootReducer))
//   })
// }