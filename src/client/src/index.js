import './styles/App.css';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';

import Immutable from 'immutable';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import httpClient from './middleware/httpClient';
import rootReducer from './reducers';
import {isProduction,googleAnalyticsId} from './config';

import Home from './pages/Home';
import Scoreboard from './pages/Scoreboard';
import Leader from './pages/Leader';
import Shop from './pages/Shop';
import OfTheWeek from './pages/OfTheWeek';
import Tips from './pages/Tips';
import About from './pages/About';
import Contact from './pages/Contact';
import Play from './pages/Play';
import AuthenticationCallback from './pages/AuthenticationCallback';

import './index.css';

ReactGA.initialize(googleAnalyticsId);
ReactGA.pageview(window.location.pathname + window.location.search);

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

const theme = createMuiTheme({
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
                      <Route path='/about' component={About}/>
                      <Route path='/play' component={Play}/>
                      <Route path='/contact' component={Contact}/>
                      <Route path='/authenticationCallback' component={AuthenticationCallback}/>
                  </Switch>
              </div>
            </main>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);