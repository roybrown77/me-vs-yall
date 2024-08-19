import { createBrowserHistory } from 'history';

import get from 'lodash/get';

import { getUserProfile, setIdToken, setAccessToken, setExpiration } from '../utilities/authenticationClient';

const refreshHistory = createBrowserHistory({forceRefresh: true});

export const ActionTypes = {
  GAMESINPROGRESS_REQUEST: 'GAMESINPROGRESS_REQUEST',
  GAMESINPROGRESS_SUCCESS: 'GAMESINPROGRESS_SUCCESS',
  GAMESINPROGRESS_FAILURE: 'GAMESINPROGRESS_FAILURE',
};

export const loadUser = () => (dispatch, getState) => {
  const state = getState();
  const ui = state.get('ui').toJS();
  const request = get(ui,'request');
  const requestStorageJson = localStorage.getItem('request');
  const requestStorage = JSON.parse(requestStorageJson);
  const leagueId = get(requestStorage, 'leagueId') || get(request, 'leagueId');
  const lookup = state.get('lookup').toJS();
  const leagues = get(lookup, 'leagues', []);
  const league = leagues.find(x=>x.id === leagueId);
  const leagueName = get(league,'name','nfl');

  setAccessToken();
  setIdToken();
  setExpiration();
  getUserProfile((err, profile) => {
    localStorage.setItem('user', JSON.stringify(profile));
    dispatch({type: 'LOGIN_SUCCESS', user: profile});
    refreshHistory.push('/scoreboards/' + leagueName);
  });
};
