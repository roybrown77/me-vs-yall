import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';
import Home from './Home';
import LeagueSelection from './LeagueSelection';
import LeagueSchedule from './LeagueSchedule';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => {
        this.setState({open: !this.state.open});
    }

    handleClose = () => {
        this.setState({open: false});
    }

   render() {
    return (
        <BrowserRouter>
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
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/') }}
                                >
                                  Home
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/league') }}
                                >
                                  Select League
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/mypicks') }}
                                >
                                  My Picks
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/about') }}
                                >
                                  About
                                </MenuItem>
                              )} />
                        )}
                    </Drawer>
                    <main>
                        <Switch>
                            <Route exact path='/' component={Home}/>
                            <Route exact path='/league' component={LeagueSelection}/>
                            <Route path='/league/:name' component={LeagueSchedule}/>
                        </Switch>
                    </main>
                </div>
            </MuiThemeProvider>
        </BrowserRouter>
    );
  }
}

export default App;