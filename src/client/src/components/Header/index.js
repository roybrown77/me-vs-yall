import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from "react-router-dom";

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToAppOutlined';

import { logout } from '../../middleware/authenticationClient';
import mvy from '../../styles/images/mvy-balls-cut.png';

const profileStyles = makeStyles((theme) => ({
  popover: {
  },
  paper: {
    padding: theme.spacing(1),
    borderRadius: '4px',
    margin: '8px',
    position: 'fixed',
    left: 'unset !important',
    right: '0',
    top: '0 !important'
  },
}));

const styles = {
  root: {
    margin: '56px 0'
  },
  appBar: {
    backgroundColor: '#f5fffa',
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

const Profile = (props) => {
  const classes = profileStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = !!anchorEl ? Boolean(anchorEl) : false;
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <div onClick={handleClick} style={{cursor:'pointer'}}>
        {props.mainElement}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {props.children}
      </Popover>
    </div>
  );
};


class Header extends Component {
  render() {
    const { classes, children } = this.props;
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson || JSON.stringify({}));
    const picture = get(user,'picture');

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar)}>
            <Typography variant="h6" color="inherit" className={classes.title} style={{margin: 'auto'}}>
            <Link to="/home">
              <img style={{height:'45px'}} src={mvy} alt=""/>
            </Link>
            </Typography>
            {
              this.props.isAuthenticated && picture &&
              <Profile mainElement={(<img className={classes.userPicture} src={picture} alt=""/>)}>
                <div style={{display:'flex', padding: '8px', cursor: 'pointer'}} onClick={() => logout()}>
                  <div>
                    <ExitToApp/>
                  </div>
                  <div style={{padding: '3px 0 0 10px'}}>
                    Sign out
                  </div>
                </div>
              </Profile>
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

    return {
        isAuthenticated,
    }
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Header));