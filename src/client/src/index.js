import './styles/App.css';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Immutable from 'immutable';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import httpClient from './middleware/httpClient';
import rootReducer from './reducers';
import {isProduction} from './config';

import Home from './pages/Home';
import Scoreboard from './pages/Scoreboard';
import Leader from './pages/Leader';
import Shop from './pages/Shop';
import OfTheWeek from './pages/OfTheWeek';
import Tips from './pages/Tips';
import Origin from './pages/Origin';
import Contact from './pages/Contact';
import Play from './pages/Play';
import AuthenticationCallback from './pages/AuthenticationCallback';

const initialState = Immutable.Map();

const composeAll = isProduction ? compose : composeWithDevTools;

const store = createStore(
  rootReducer,
  initialState,
  composeAll(
    applyMiddleware(
      thunkMiddleware,
      httpClient
      )
  )
);

const theme = createTheme({
  typography: {
      useNextVariants: true
    }
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <div className="App">
            <main>
              <div style={{height:'100%'}}>
                  <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/scoreboards/:leagueName' component={Scoreboard}/>
                    <Route path='/leaders/:leagueName' component={Leader}/>
                    <Route path='/shop' component={Shop}/>
                    <Route path='/oftheweek' component={OfTheWeek}/>
                    <Route path='/tips' component={Tips}/>
                    <Route path='/origin' component={Origin}/>
                    <Route path='/play' component={Play}/>
                    <Route path='/contact' component={Contact}/>
                    <Route path='/authenticationCallback' component={AuthenticationCallback}/>
                    <Route path='*' component={Home}/>
                  </Switch>
              </div>
            </main>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);