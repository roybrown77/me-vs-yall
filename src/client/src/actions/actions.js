import { createBrowserHistory } from 'history';

import get from 'lodash/get';

import { CALL_API, Schemas } from '../middleware/httpClient';
import { getUserProfile, setIdToken, setAccessToken, setExpiration } from '../middleware/authenticationClient';

const refreshHistory = createBrowserHistory({forceRefresh: true});

export const ActionTypes = {
  ARTICLES_REQUEST: 'ARTICLES_REQUEST',
  ARTICLES_SUCCESS: 'ARTICLES_SUCCESS',
  ARTICLES_FAILURE: 'ARTICLES_FAILURE',

  GAMESINPROGRESS_REQUEST: 'GAMESINPROGRESS_REQUEST',
  GAMESINPROGRESS_SUCCESS: 'GAMESINPROGRESS_SUCCESS',
  GAMESINPROGRESS_FAILURE: 'GAMESINPROGRESS_FAILURE',
};

const fetchGamesInProgress = () => ({
  [CALL_API]: {
    types: [ ActionTypes.GAMESINPROGRESS_REQUEST, ActionTypes.GAMESINPROGRESS_SUCCESS, ActionTypes.GAMESINPROGRESS_FAILURE ],
    endpoint: `/api/gamemanagement/gamesInProgress`,
    schema: Schemas.GAME_ARRAY
  }
});

const fetchArticles = query => ({
  [CALL_API]: {
    types: [ ActionTypes.ARTICLES_REQUEST, ActionTypes.ARTICLES_SUCCESS, ActionTypes.ARTICLES_FAILURE ],
    endpoint: `/api/articlemanagement/articles`,
    schema: Schemas.ARTICLE_ARRAY
  }
});

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

export const loadGamesInProgress = () => (dispatch, getState) => {
  dispatch(fetchGamesInProgress());
};

export const loadArticles = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch(fetchArticles());
};
