import injectTapEventPlugin from 'react-tap-event-plugin';
import './styles/App.css';
injectTapEventPlugin();

import { AppContainer } from 'react-hot-loader'; // remove if not using
import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import Immutable from 'immutable';
import React from 'react';
import thunk from 'redux-thunk';

import App from './containers/App';
import api from './middleware/api';
import rootReducer from './reducers';

const history = createBrowserHistory();
const initialState = Immutable.Map();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const router = routerMiddleware(history);

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composeEnhancer(
    applyMiddleware(thunk.withExtraArgument(api), router)
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