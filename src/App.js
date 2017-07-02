import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

import './App.css';
import Home from './Home';
import LeagueSelection from './LeagueSelection';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => this.setState({open: !this.state.open});
    handleClose = () => this.setState({open: false});

   render() {
    return (
        <MuiThemeProvider>
            <div className="App">
                <AppBar
                    id="app-bar"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onTouchTap={this.handleToggle}
                    />
                <Drawer docked={false}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}
                    >
                    <MenuItem onTouchTap={this.handleClose}>Home</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>Select League</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>My Picks</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>About</MenuItem>
                </Drawer>
                <Router history={browserHistory}>
                    <Route path="/" component={Home}/>
                    <Route path="/selectleague" component={LeagueSelection}/>
              </Router>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;