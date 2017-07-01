import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router'

import AppShell from './AppShell';
import './App.css';

class App extends Component {
   render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AppShell}/>
        <Route path="/about" component={AppShell}/>
        <Route path="/settings" component={AppShell}/>
      </Router>
    );
  }
}

export default App;