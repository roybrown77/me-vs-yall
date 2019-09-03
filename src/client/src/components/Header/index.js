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

import { googleLogin, logout } from '../../middleware/authenticationService';

const styles = {
  root: {
    margin: '56px 0'
  },
  appBar: {
    backgroundColor: '#f4f7f6',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '55px'
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
    textAlign: 'right',
    padding: '4px 0'
  },
  toolbar: {
    minHeight: '55px'
  },
  hide: {
    display: 'none',
  },
  list: {
    width: 250,
  },
  userPicture: {
    height: '40px',
    width: '40px',
    borderRadius: '8px',
    margin: '8px',
    position: 'fixed',
    right: '0',
    top: '0'
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

  gram = () => {
    window.location = "https://www.instagram.com/_mevsyall";
  };

  render() {
    const { classes, theme, children, leagueName } = this.props;
    const { anchor, open } = this.state;
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson || JSON.stringify({}));
    const picture = get(user,'picture');

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar)}>
            <Toolbar className={classNames(classes.toolbar)} disableGutters={!open}>
              <Typography variant="h6" color="inherit" className={classes.title} style={{margin: 'auto'}}>
                Me vs Yall
              </Typography>
              {
                this.props.isAuthenticated && picture &&
                <img className={classes.userPicture} src={picture} alt=""/>
              }
            </Toolbar>
          </AppBar>
          <main>
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