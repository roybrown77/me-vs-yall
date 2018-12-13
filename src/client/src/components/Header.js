import React, { Component } from 'react';
import { Route }from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import { googleLogin, logout } from '../middleware/authenticationService';

const styles = {
  root: {
    margin: '56px 0'
  },
  appBar: {
    backgroundColor: '#f4f7f6',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '65px'
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  title: {
    width: '100%',
    fontSize: '17px',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  drawerHeader: {
    textAlign: 'right'
  },
  toolbar: {
    minHeight: '65px'
  },
  hide: {
    display: 'none',
  },
  list: {
    width: 250,
  },
  userPicture: {
    height: '50px',
    width: '50px',
    borderRadius: '8px',
    margin: '8px'
  }
};


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: 'left',
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, children, leagueName } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <SwipeableDrawer
        variant="persistent"
        anchor={anchor}
        open={open}
        onOpen={()=>{}}
        onClose={()=>{}}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>{(
                    <Route render={({ history}) => (
                      <MenuItem
                        onClick={() => { history.push('/') }}
                      >
                        <div style={{fontStyle: 'italic'}}>MvY</div>
                      </MenuItem>
                    )} />
                  )}
                  {(
                    <Route render={({history}) => (
                      <MenuItem
                         onClick={() => { history.push('/scoreboards/' + leagueName) }}
                         >
                         Scores
                         </MenuItem>
                     )} />
                  )}
                  {(
                    <Route render={({ history}) => (
                        <MenuItem
                          onClick={() => { history.push('/leaders/' + leagueName) }}
                        >
                          Leaders
                        </MenuItem>
                      )} />
                  )}
                  {(
                      <Route render={({ history}) => (
                          <MenuItem
                            onClick={() => { history.push('/statOfTheWeek') }}
                          >
                            SOTW
                          </MenuItem>
                        )} />
                  )}
                  {(
                      <Route render={({ history}) => (
                          <MenuItem
                            onClick={() => { history.push('/feedback') }}
                          >
                            Tell MvY How To Get Better
                          </MenuItem>
                        )} />
                  )}
                  {(
                      <Route render={({ history}) => (
                          <MenuItem
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
                            onClick={() => logout()}
                          >
                            Logout
                          </MenuItem>
                        )} />
                  ) : 
                  (
                    <MenuItem onClick={() => googleLogin()}>
                      Login
                    </MenuItem>
                  )
                }</List>
      </SwipeableDrawer>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar)}>
            <Toolbar className={classNames(classes.toolbar)} disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.title} style={{marginRight: '75px'}}>
                Me vs Yall
              </Typography>
            </Toolbar>
          </AppBar>
          {drawer}
          <main style={{paddingTop:'10px'}}>
            {children}
          </main>
        </div>
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
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Header));