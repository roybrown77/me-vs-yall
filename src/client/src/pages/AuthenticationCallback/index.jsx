import { useEffect } from 'react';

import { getUserProfile, setIdToken, setAccessToken, setExpiration } from '../../utilities/authenticationClient';
import useGoogleAnalytics from '../../utilities/useGoogleAnalytics';

const AuthenticationCallback = () => {
  useGoogleAnalytics();

  useEffect(() => {
    const loadUser = () => {
      // Set tokens and expiration
      setAccessToken();
      setIdToken();
      setExpiration();

      // Fetch user profile
      getUserProfile((err, profile) => {
        if (!err && profile) {
          // Store the user profile in local storage
          localStorage.setItem('user', JSON.stringify(profile));

          // Remove '/authenticationCallback' from the URL and redirect
          window.location.href = '/scoreboards/nfl';
        } else {
          console.error('Error loading user profile:', err);
          window.location.href = '/';
        }
      });
    };

    // Call loadUser when the component mounts
    loadUser();
  }, []);

  return null;
};

export default AuthenticationCallback;
