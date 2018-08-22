import React, { Component } from 'react';
import { Route }from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import { logout } from '../middleware/authenticationService';

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
    return (<div>
              <AppBar
                id="app-bar"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                onTouchTap={this.handleToggle}
                />
              <Drawer docked={false}
                open={this.state.open}
                style={{fontWeight: 'bold', textAlign:'left'}}
                onRequestChange={(open) => this.setState({open})}>
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
                        >
                          How to Play
                        </MenuItem>
                      )} />
                    )}
                  {(
                    <Route render={({ history}) => (
                        <MenuItem
                          onTouchTap={this.handleClose}
                        >
                          Leagues
                        </MenuItem>
                      )} />
                  )}
                  {(
                    <Route render={({history}) => (
                      <MenuItem
                         onTouchTap={this.handleClose}
                         onClick={() => { history.push('/scoreboards/nfl') }}
                         >
                         Scoreboards
                         </MenuItem>
                     )} />
                  )}
                  {(
                    <Route render={({ history}) => (
                        <MenuItem
                          onTouchTap={this.handleClose}
                          onClick={() => { history.push('/leaders/nfl') }}
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
                    this.props.isAuthenticated ? (
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

const mapStateToProps = (state, ownProps) => {
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
        isAuthenticated
    }
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps)(Header);