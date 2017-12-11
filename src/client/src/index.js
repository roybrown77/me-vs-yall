import './styles/App.css';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
//import { composeWithDevTools } from 'redux-devtools-extension';

import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './containers/App';
import api from './middleware/api';
import rootReducer from './reducers';

injectTapEventPlugin();

const initialState = Immutable.Map();

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(
      thunkMiddleware,
      api
      )
  )
);

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);