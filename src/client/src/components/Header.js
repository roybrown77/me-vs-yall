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
    const leagueName = this.props.leagueName;

    return (<div>
              <AppBar
                id="app-bar"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                onTouchTap={this.handleToggle}
                title={'Me vs Yall'}
                titleStyle={{
                    fontSize: 17,
                    color: '#000000',
                    fontWeight: '600',
                    fontStyle: 'italic'
                  }}
                style={{
                  position: 'fixed',
                  top: 0
                }}
                />
              <Drawer docked={false}
                open={this.state.open}
                style={{fontWeight: 'bold', textAlign:'left'}}
                onRequestChange={(open) => this.setState({open})}>
                  {(
                    <Route render={({ history}) => (
                      <MenuItem
                        onTouchTap={this.handleClose}
                        onClick={() => { history.push('/howtoplay') }}
                      >
                        How to Play
                      </MenuItem>
                    )} />
                  )}
                  {(
                    <Route render={({history}) => (
                      <MenuItem
                         onTouchTap={this.handleClose}
                         onClick={() => { history.push('/scoreboards/' + leagueName) }}
                         >
                         Scores
                         </MenuItem>
                     )} />
                  )}
                  {(
                    <Route render={({ history}) => (
                        <MenuItem
                          onTouchTap={this.handleClose}
                          onClick={() => { history.push('/leaders/' + leagueName) }}
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
                            News
                          </MenuItem>
                        )} />
                  )}
                  {(
                      <Route render={({ history}) => (
                          <MenuItem
                            onTouchTap={this.handleClose}
                            onClick={() => { history.push('/feedback') }}
                          >
                            Tell MvY How To Get Better
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

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const lookup = state.get('lookup').toJS();
    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const leagueName = get(league,'name','nfl');

    return {
        isAuthenticated,
        leagueName
    }
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    leagueName: PropTypes.string,
};

export default connect(mapStateToProps)(Header);