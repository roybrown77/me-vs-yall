import React, { Component } from 'react';
import { Route }from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import { logout, isLoggedIn } from '../middleware/AuthService';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleClose = () => {
        this.setState({open: false});
    };

   render() {
    return (
                <div>
                    <AppBar
                        id="app-bar"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onTouchTap={this.handleToggle}
                        />
                    <Drawer docked={false}
                            open={this.state.open}
                            style={{fontWeight: 'bold', textAlign:'left'}}
                            onRequestChange={(open) => this.setState({open})}
                        >
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  style={{marginTop:'2em'}}
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
                                  onClick={() => { history.push('/leagues') }}
                                >
                                  Leagues
                                </MenuItem>
                              )} />
                        )}
                       {(
                           <Route render={({ history}) => (
                           <MenuItem
                               onTouchTap={this.handleClose}
                               onClick={() => { history.push('/leagues/nfl') }}
                           >
                               Schedules
                               </MenuItem>
                           )} />
                       )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                >
                                  Leaders
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                >
                                  Me
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                >
                                  Yall
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                >
                                  Feedback
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
                        {
                          isLoggedIn() ? (
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => logout()}
                                >
                                  Logout
                                </MenuItem>
                              )} />
                        ) : 
                        (
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/login') }}
                                >
                                  Login
                                </MenuItem>
                              )} />
                        )
                      }
                    </Drawer>
                </div>
    );
  }
}

export default Header;