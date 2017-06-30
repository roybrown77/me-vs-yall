import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './MyAwesomeReactComponent';
import { Router, browserHistory, Route, Link } from 'react-router'

import logo from './logo.svg';
import './App.css';

const Page = ({ title }) => (
<MuiThemeProvider>
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{title}</h2>
      </div>
      <p className="App-intro">
        This is the {title} page.
      </p>
      <MyAwesomeReactComponent />
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <Link to="/about">About</Link>
      </p>
      <p>
        <Link to="/settings">Settings</Link>
      </p>
    </div>
    </MuiThemeProvider>
)

const Home = (props) => (
  <Page title="Home"/>
)

const About = (props) => (
  <Page title="About"/>
)

const Settings = (props) => (
  <Page title="Settings"/>
)

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </Router>
    );
  }
}

export default App;
