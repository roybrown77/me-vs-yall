import { useEffect } from 'react';

import {
  cacheUserFromIdToken,
  consumePostLoginRedirect,
  getUserProfile,
  setConfirmedContinueAuthentication,
  setIdToken,
  setAccessToken,
  setExpiration,
} from '../../utilities/authenticationClient';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

const AuthenticationCallback = () => {
  useGoogleAnalytics();

  useEffect(() => {
    const loadUser = () => {
      // Set tokens and expiration
      setAccessToken();
      setIdToken();
      setExpiration();
      setConfirmedContinueAuthentication(true);
      cacheUserFromIdToken();

      getUserProfile((err, profile) => {
        if (!err && profile) {
          localStorage.setItem('user', JSON.stringify(profile));
        } else if (err) {
          console.error('Error loading user profile:', err);
        }

        window.location.assign(consumePostLoginRedirect());
      });
    };

    // Call loadUser when the component mounts
    loadUser();
  }, []);

  return null;
};

export default AuthenticationCallback;
