import { createBrowserHistory } from 'history';

import { getUserProfile, setIdToken, setAccessToken, setExpiration } from '../utilities/authenticationClient';
import { getLeagueName } from '../utilities/getLeagueName';

const refreshHistory = createBrowserHistory({forceRefresh: true});

export const ActionTypes = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
};

export const loadUser = () => (dispatch) => {
  setAccessToken();
  setIdToken();
  setExpiration();
  getUserProfile((err, profile) => {
    localStorage.setItem('user', JSON.stringify(profile));
    dispatch({type: 'LOGIN_SUCCESS', user: profile});
    refreshHistory.push(`/scoreboards/${getLeagueName()}`);
  });
};
