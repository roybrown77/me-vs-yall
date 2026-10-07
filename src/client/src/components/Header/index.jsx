import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import get from 'lodash/get';

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';

import { googleLogin, isConfirmedAuthentication, logout, getUser } from '../../utilities/authenticationClient';
import mvy from '../../styles/images/mvy-balls-cut.png';

import './header.css';

const styles = {
  root: {
    margin: '56px 0'
  },
  appBar: {
    backgroundColor: '#ffe8a3',
    color: 'rgba(0, 0, 0, 0.87)',
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
    top: '0',
    cursor: 'pointer',
  },
  userDefaultPicture: {
    height: '40px',
    width: '40px',
    borderRadius: '8px',
    margin: '8px',
    position: 'fixed',
    right: '0',
    top: '0',
    backgroundColor: '#707070',
    color: '#fff',
    fontSize: '1.25rem'
  } 
};

const Profile = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const popoverContent = typeof props.children === 'function'
    ? props.children({ close: handleClose })
    : props.children;

  return (
    <div>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {props.mainElement}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ className: 'header-signout-popover__paper' }}
      >
        {popoverContent}
      </Popover>
    </div>
  );
};

const Header = (props) => {
  const { children, disableTopBanner} = props;
  const isAuthenticated = isConfirmedAuthentication();
  const user = getUser();
  const picture = get(user,'picture');
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const rootStyle = disableTopBanner ? { margin: 0 } : styles.root;
  const showProfileImage = isAuthenticated && picture && !profileImageFailed;

  useEffect(() => {
    setProfileImageFailed(false);
  }, [picture]);

  return (
    <div style={rootStyle}>
      <div style={styles.appFrame}>
        <AppBar style={{
          ...styles.appBar,
          ...disableTopBanner ? { backgroundColor: 'transparent' } : {}
        }}>
          <Typography variant="h6" color="inherit" style={{ ...styles.title, margin: 'auto' }}>
            {!disableTopBanner && (
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img style={{ height: '45px', width: '90px' }} src={mvy} alt="Logo" />
              </Link>
            )}
          </Typography>
          {showProfileImage && (
            <Profile mainElement={(<img style={styles.userPicture} src={picture} alt="User Profile" onError={() => setProfileImageFailed(true)} />)}>
              {({ close }) => (
                <div className="header-signout-popover">
                  <div className="header-signout-popover__kicker">Account</div>
                  <div className="header-signout-popover__identity">{get(user, 'name', 'Me vs Yall Player')}</div>
                  <div className="header-signout-popover__actions">
                    <button
                      type="button"
                      className="header-signout-popover__btn header-signout-popover__btn--ghost"
                      onClick={close}
                    >
                      Stay Signed In
                    </button>
                    <button
                      type="button"
                      className="header-signout-popover__btn header-signout-popover__btn--danger"
                      onClick={() => {
                        close();
                        logout();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </Profile>
          )}
          {isAuthenticated && !showProfileImage && (
            <Profile
              mainElement={(
                <div style={styles.userDefaultPicture} title="User Profile">
                  <div style={{ margin: '8px 0' }}>
                    {String(get(user, 'name', '?') || '?')[0]}
                  </div>
                </div>
              )}
            >
              {({ close }) => (
                <div className="header-signout-popover">
                  <div className="header-signout-popover__kicker">Account</div>
                  <div className="header-signout-popover__identity">
                    {get(user, 'name', 'Me vs Yall Player')}
                  </div>
                  <div className="header-signout-popover__actions">
                    <button
                      type="button"
                      className="header-signout-popover__btn header-signout-popover__btn--ghost"
                      onClick={close}
                    >
                      Stay Signed In
                    </button>
                    <button
                      type="button"
                      className="header-signout-popover__btn header-signout-popover__btn--danger"
                      onClick={() => {
                        close();
                        logout();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </Profile>
          )}
          {!isAuthenticated && (
            <button
              type="button"
              className="header-sign-in-btn"
              onClick={googleLogin}
              aria-label="Sign in"
            >
              <span className="header-sign-in-btn__icon" aria-hidden="true">⚡</span>
              <span className="header-sign-in-btn__label-wrap">
                <span className="header-sign-in-btn__eyebrow">GITTY UP</span>
                <span className="header-sign-in-btn__label">SIGN IN</span>
              </span>
            </button>
          )}
        </AppBar>
        <main className="home-splash">
          {children}
        </main>
      </div>
    </div>
  );
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
    disableTopBanner: PropTypes.bool,
};

export default Header;
