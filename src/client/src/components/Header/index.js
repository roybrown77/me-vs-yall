import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';

import mvy from '../../styles/images/mvy.png';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import { googleLogin, logout } from '../../middleware/authenticationService';

const styles = {
  root: {
    margin: '56px 0'
  },
  appBar: {
    backgroundColor: '#f4f7f6',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '55px',
    padding: '5px',
    boxShadow: 'none'
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
  },
  userDefaultPicture: {
    height: '40px',
    width: '40px',
    borderRadius: '8px',
    margin: '8px',
    position: 'fixed',
    right: '0',
    top: '0',
    backgroundColor: '#3772FA',
    color: '#fff',
    fontSize: '1.25rem'
  } 
};


class Header extends Component {
  render() {
    const { classes, theme, children, leagueName } = this.props;
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson || JSON.stringify({}));
    const picture = get(user,'picture');

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar)}>
            <Typography variant="h6" color="inherit" className={classes.title} style={{margin: 'auto'}}>
              <img style={{height:'45px'}}src={mvy} alt=""/>
            </Typography>
            {
              this.props.isAuthenticated && picture &&
              <img className={classes.userPicture} src={picture} alt=""/>
            }
            {
              this.props.isAuthenticated && !picture &&
              <div className={classes.userDefaultPicture}>
                <div style={{margin: '8px 0'}}>{user.name[0]}</div>
              </div>
            }
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