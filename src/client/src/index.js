import './styles/App.css';

import React, {lazy, Suspense} from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';

import Immutable from 'immutable';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import httpClient from './middleware/httpClient';
import rootReducer from './reducers';

const { isProduction, googleAnalyticsId } = lazy(() => import('./config'));
const Home = lazy(() => import('./pages/Home'));
const Scoreboard = lazy(() => import('./pages/Scoreboard'));
const Leader = lazy(() => import('./pages/Leader'));
const Shop = lazy(() => import('./pages/Shop'));
const OfTheWeek = lazy(() => import('./pages/OfTheWeek'));
const Tips = lazy(() => import('./pages/Tips'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Play = lazy(() => import('./pages/Play'));
const AuthenticationCallback = lazy(() => import('./pages/AuthenticationCallback'));

lazy(() => import('./index.css'));

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

const theme = createTheme({
  typography: {
      useNextVariants: true
    }
});

render(
  <Suspense fallback={<div>Welcome to Me vs Yall! Your sports are loading...</div>}>
    <Provider store={store}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <main>
              <div style={{height:'100%'}}>
                <Switch>
                  <Route exact path='/'>
                    <Redirect to='/scoreboards/nfl' />  
                  </Route>
                  <Route path='/home' component={Home}/>
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
    </Provider>
  </Suspense>,
  document.getElementById('root')
);