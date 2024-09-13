import { useEffect } from 'react';
import { createBrowserHistory } from 'history';

import { getUserProfile, setIdToken, setAccessToken, setExpiration } from '../../utilities/authenticationClient';

const history = createBrowserHistory({ forceRefresh: true });

const AuthenticationCallback = () => {
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
          history.push(`/scoreboards/nfl`);
        } else {
          console.error('Error loading user profile:', err);
        }
      });
    };

    // Call loadUser when the component mounts
    loadUser();
  }, []);

  return null;
};

export default AuthenticationCallback;
