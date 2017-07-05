import React, { Component } from 'react';
import { Route }from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
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
                <div>
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
                                  League Sport
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/leaders') }}
                                >
                                  Leaders
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/me') }}
                                >
                                  Me
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/yall') }}
                                >
                                  Yall
                                </MenuItem>
                              )} />
                        )}
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/feedback') }}
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
                        {(
                            <Route render={({ history}) => (
                                <MenuItem
                                  onTouchTap={this.handleClose}
                                  onClick={() => { history.push('/login') }}
                                >
                                  Login
                                </MenuItem>
                              )} />
                        )}
                    </Drawer>
                </div>
    );
  }
}

export default Header;