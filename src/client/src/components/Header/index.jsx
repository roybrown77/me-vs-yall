import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import get from 'lodash/get';

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';

import { googleLogin, isConfirmedAuthentication, logout, getUser } from '../../utilities/authenticationClient';
import mvy from '../../styles/images/mvy-balls-cut.png';
import { callApi } from '../../utilities/http';

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
        style={{ left: 'unset', right: '0' }}
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

const Header = (props) => {
  const { children, disableTopBanner} = props;
  const isAuthenticated = isConfirmedAuthentication();
  const user = getUser();
  const picture = get(user,'picture');

  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notificationsSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  useEffect(() => {
    const load = async () => {
      if (!import.meta.env.PROD) return;
      if (!isAuthenticated) return;

      try {
        const result = await callApi({
          method: 'GET',
          endpoint: '/api/notificationmanagement/subscriptions/me',
        });
        setNotificationsEnabled(Boolean(result?.subscribed));
      } catch {
        // ignore
      }
    };

    load();
  }, [isAuthenticated]);

  const enableNotifications = useCallback(async () => {
    try {
      setIsEnablingNotifications(true);

      if (!('serviceWorker' in navigator)) {
        alert('Notifications are not supported in this browser.');
        return;
      }

      if (!('PushManager' in window)) {
        alert('Push notifications are not supported in this browser.');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const { publicKey } = await callApi({
        method: 'GET',
        endpoint: '/api/notificationmanagement/vapidPublicKey',
      });

      const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
        return outputArray;
      };

      // Ensure SW is ready (production/preview). In dev we don't register SW.
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();

      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await callApi({
        method: 'POST',
        endpoint: '/api/notificationmanagement/subscriptions',
        body: {
          subscription,
          userAgent: navigator.userAgent,
        },
      });

      setNotificationsEnabled(true);
    } catch (error) {
      console.error(error);
      alert('Could not enable notifications.');
    } finally {
      setIsEnablingNotifications(false);
    }
  }, []);

  return (
    <div style={styles.root}>
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
          {isAuthenticated && picture && (
            <Profile mainElement={(<img style={styles.userPicture} src={picture} alt="User Profile" />)}>
              <div
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'fixed',
                  right: '0',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ margin: 'auto 10px' }}>
                  <span style={{ fontSize: '.7rem' }}>📱</span> Sign out
                </div>
              </div>
            </Profile>
          )}
          {isAuthenticated && !picture && (
            <div style={styles.userDefaultPicture} title="User Profile">
              <div style={{ margin: '8px 0' }}>{user.name[0]}</div>
            </div>
          )}
          {!isAuthenticated && (
            <div
              style={{
                position: 'fixed',
                right: '0',
                top: '0',
                margin: '5px',
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, color 0.3s'
              }}
              onClick={googleLogin}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fb8239';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
              }}
            >
              <span style={{ fontSize: '.7rem' }}>📱</span> SIGN IN
            </div>
          )}

          {false && import.meta.env.PROD && isAuthenticated && notificationsSupported && !notificationsEnabled && (
            <div
              style={{
                position: 'fixed',
                right: '0',
                top: '60px',
                margin: '5px',
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: isEnablingNotifications ? 'default' : 'pointer',
                opacity: isEnablingNotifications ? 0.7 : 1,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s, color 0.3s',
                zIndex: 1000,
              }}
              onClick={isEnablingNotifications ? undefined : enableNotifications}
              onMouseEnter={(e) => {
                if (isEnablingNotifications) return;
                e.target.style.backgroundColor = '#fb8239';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                if (isEnablingNotifications) return;
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
              }}
              title="Enable push notifications"
            >
              <span style={{ fontSize: '.7rem' }}>🔔</span> {isEnablingNotifications ? 'ENABLING…' : 'NOTIFY'}
            </div>
          )}
        </AppBar>
        <main>
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
