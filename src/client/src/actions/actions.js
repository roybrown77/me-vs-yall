import queryString from 'query-string';
import URLSearchParams from 'url-search-params';
import {createBrowserHistory} from 'history';

import get from 'lodash/get';
import last from 'lodash/last';

import { CALL_API, Schemas } from '../middleware/httpClient';
import { getUserProfile, getUser, setIdToken, setAccessToken, setExpiration } from '../middleware/authenticationClient';

import { getCurrentWeek } from '../utilities';

const refreshHistory = createBrowserHistory({forceRefresh: true});

export const ActionTypes = {
  LEADERS_REQUEST: 'LEADERS_REQUEST',
  LEADERS_SUCCESS: 'LEADERS_SUCCESS',
  LEADERS_FAILURE: 'LEADERS_FAILURE',

  LEADER_GAMES_REQUEST: 'LEADER_GAMES_REQUEST',
  LEADER_GAMES_SUCCESS: 'LEADER_GAMES_SUCCESS',
  LEADER_GAMES_FAILURE: 'LEADER_GAMES_FAILURE',

  LEADER_PICKS_REQUEST: 'LEADER_PICKS_REQUEST',
  LEADER_PICKS_SUCCESS: 'LEADER_PICKS_SUCCESS',
  LEADER_PICKS_FAILURE: 'LEADER_PICKS_FAILURE',

  SCOREBOARD_REQUEST: 'SCOREBOARD_REQUEST',
  SCOREBOARD_SUCCESS: 'SCOREBOARD_SUCCESS',
  SCOREBOARD_FAILURE: 'SCOREBOARD_FAILURE',

  SCOREBOARD_GAMES_REQUEST: 'SCOREBOARD_GAMES_REQUEST',
  SCOREBOARD_GAMES_SUCCESS: 'SCOREBOARD_GAMES_SUCCESS',
  SCOREBOARD_GAMES_FAILURE: 'SCOREBOARD_GAMES_FAILURE',

  SCOREBOARD_PICKS_REQUEST: 'SCOREBOARD_PICKS_REQUEST',
  SCOREBOARD_PICKS_SUCCESS: 'SCOREBOARD_PICKS_SUCCESS',
  SCOREBOARD_PICKS_FAILURE: 'SCOREBOARD_PICKS_FAILURE',

  USERS_REQUEST: 'USERS_REQUEST',
  USERS_SUCCESS: 'USERS_SUCCESS',
  USERS_FAILURE: 'USERS_FAILURE',

  TEAMS_REQUEST: 'TEAMS_REQUEST',
  TEAMS_SUCCESS: 'TEAMS_SUCCESS',
  TEAMS_FAILURE: 'TEAMS_FAILURE',

  ARTICLES_REQUEST: 'ARTICLES_REQUEST',
  ARTICLES_SUCCESS: 'ARTICLES_SUCCESS',
  ARTICLES_FAILURE: 'ARTICLES_FAILURE',

  CREATEUSER_REQUEST: 'CREATEUSER_REQUEST',
  CREATEUSER_SUCCESS: 'CREATEUSER_SUCCESS',
  CREATEUSER_FAILURE: 'CREATEUSER_FAILURE',

  ADDPICK_REQUEST: 'ADDPICK_REQUEST',
  ADDPICK_SUCCESS: 'ADDPICK_SUCCESS',
  ADDPICK_FAILURE: 'ADDPICK_FAILURE',

  UPDATEPICK_REQUEST: 'UPDATEPICK_REQUEST',
  UPDATEPICK_SUCCESS: 'UPDATEPICK_SUCCESS',
  UPDATEPICK_FAILURE: 'UPDATEPICK_FAILURE',

  UPDATEGAME_REQUEST: 'UPDATEGAME_REQUEST',
  UPDATEGAME_SUCCESS: 'UPDATEGAME_SUCCESS',
  UPDATEGAME_FAILURE: 'UPDATEGAME_FAILURE',

  GAMEWEEKS_REQUEST: 'GAMEWEEKS_REQUEST',
  GAMEWEEKS_SUCCESS: 'GAMEWEEKS_SUCCESS',
  GAMEWEEKS_FAILURE: 'GAMEWEEKS_FAILURE',

  GAMESINPROGRESS_REQUEST: 'GAMESINPROGRESS_REQUEST',
  GAMESINPROGRESS_SUCCESS: 'GAMESINPROGRESS_SUCCESS',
  GAMESINPROGRESS_FAILURE: 'GAMESINPROGRESS_FAILURE',

  RESET_ERROR_MESSAGE: 'RESET_ERROR_MESSAGE',
};

export const resetErrorMessage = () => ({
    type: ActionTypes.RESET_ERROR_MESSAGE
});

const createUser = profile => ({
  [CALL_API]: {
    types: [ ActionTypes.CREATEUSER_REQUEST, ActionTypes.CREATEUSER_SUCCESS, ActionTypes.CREATEUSER_FAILURE ],
    endpoint: '/api/usermanagement/users',
    method: 'post',
    schema: Schemas.USER,
    body: {
      sub: profile.sub,
      email: profile.email,
      family_name: profile.family_name,
      given_name: profile.given_name,
      picture: profile.picture
    }
  }
});

const createPick = pick => ({
  [CALL_API]: {
    types: [ ActionTypes.ADDPICK_REQUEST, ActionTypes.ADDPICK_SUCCESS, ActionTypes.ADDPICK_FAILURE ],
    endpoint: '/api/pickmanagement/picks',
    method: 'POST',
    body: pick,
    schema: Schemas.PICK
  }
});

const editPick = (id, pick) => ({
  id,
  [CALL_API]: {
    types: [ ActionTypes.UPDATEPICK_REQUEST, ActionTypes.UPDATEPICK_SUCCESS, ActionTypes.UPDATEPICK_FAILURE ],
    endpoint: '/api/pickmanagement/picks/' + encodeURIComponent(id),
    method: 'PUT',
    body: pick,
    schema: Schemas.PICK
  }
});

const editGame = (id, game) => ({
  id,
  [CALL_API]: {
    types: [ ActionTypes.UPDATEGAME_REQUEST, ActionTypes.UPDATEGAME_SUCCESS, ActionTypes.UPDATEGAME_FAILURE ],
    endpoint: '/api/gamemanagement/games/' + encodeURIComponent(id),
    method: 'PUT',
    body: game,
    schema: Schemas.GAME
  }
});

const fetchGamesInProgress = () => ({
  [CALL_API]: {
    types: [ ActionTypes.GAMESINPROGRESS_REQUEST, ActionTypes.GAMESINPROGRESS_SUCCESS, ActionTypes.GAMESINPROGRESS_FAILURE ],
    endpoint: `/api/gamemanagement/gamesInProgress`,
    schema: Schemas.GAME_ARRAY
  }
});

const fetchGameWeeks = query => ({
  [CALL_API]: {
    types: [ ActionTypes.GAMEWEEKS_REQUEST, ActionTypes.GAMEWEEKS_SUCCESS, ActionTypes.GAMEWEEKS_FAILURE ],
    endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

const fetchGames = (query, types) => ({
  [CALL_API]: {
    types,
    endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

const fetchPicks = (query, types) => ({
  [CALL_API]: {
    types,
    endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
    schema: Schemas.PICK_ARRAY
  }
});

const fetchAllUsers = (query) => ({
  [CALL_API]: {
    types: [ ActionTypes.USERS_REQUEST, ActionTypes.USERS_SUCCESS, ActionTypes.USERS_FAILURE ],
    endpoint: `/api/usermanagement/users?${queryString.stringify(query)}`,
    schema: Schemas.USER_ARRAY
  }
});

const fetchAllTeams = (types) => ({
  [CALL_API]: {
    types,
    endpoint: `/api/gamemanagement/teams`,
    schema: Schemas.TEAM_ARRAY
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

export const selectWeek = (week) => (dispatch, getState) => {
  dispatch({
    type: 'GAMESEARCHUPDATE',
    week
  });
};

export const showGameDetailsToggle = (flag) => (dispatch, getState) => {
  dispatch({
    type: 'SHOWGAMEDETAILSTOGGLE',
    flag
  });
};

export const addPick = (pick) => (dispatch, getState) => {
  const searchParams = new URLSearchParams();
  searchParams.set('gameId', pick.gameId);
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameType', pick.gameType);

  dispatch(createPick(searchParams));
};

export const updatePick = (id, pick) => (dispatch, getState) => {
  const searchParams = new URLSearchParams();
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameId', pick.gameId);
  searchParams.set('gameType', pick.gameType);

  dispatch(editPick(id, searchParams));
};

export const updateGame = (game) => (dispatch, getState) => {
  const searchParams = new URLSearchParams();
  searchParams.set('id', game.id);
  searchParams.set('awayScore', game.awayScore);
  searchParams.set('homeScore', game.homeScore);
  searchParams.set('awayRank', game.awayRank);
  searchParams.set('homeRank', game.homeRank);
  searchParams.set('awayRecord', game.awayRecord);
  searchParams.set('homeRecord', game.homeRecord);
  searchParams.set('awaySpread', game.awaySpread);
  searchParams.set('homeSpread', game.homeSpread);
  searchParams.set('gameName', game.gameName);
  searchParams.set('isGameOver', game.isGameOver);
  searchParams.set('currentTime', game.currentTime);
  searchParams.set('gameTime', game.gameTime);
  searchParams.set('liveVideoUrl', game.liveVideoUrl);
  searchParams.set('highlightVideoUrl', game.highlightVideoUrl);
  searchParams.set('isHidden', game.isHidden);

  dispatch(editGame(game.id, searchParams));
};

export const loadScoreboard = (query, requiredFields = []) => async (dispatch, getState) => {
  const currentState = getState();
  const leagueName = window.location.pathname.split('/')[2];
  const lookup = currentState.get('lookup').toJS();
  const leagues = get(lookup, 'leagues', []);
  const currentLeague = leagues.find(x=>x.name === leagueName);
  const leagueId = currentLeague.id;
  const leagueChanged = get(query, 'leagueId') !== leagueId;
  const gameType = get(query, 'gameType');
  const loading = get(query, 'loading');

  const year = leagueChanged ? last(currentLeague.years) : get(query, 'year');

  const gameWeeks = await dispatch(fetchGameWeeks({leagueId,year}));
  const authenticationDomain = currentState.get('authenticationDomain').toJS();
  const userInSession = getUser();
  const user = get(authenticationDomain,'user',userInSession);
  const weeks = get(gameWeeks,'response',[]);
  const currentWeek = getCurrentWeek(weeks);

  const request = {
    userId: get(user,'sub'),
    leagueId: leagueId,
    weekId: leagueChanged ? get(currentWeek, 'weekId') : (get(query, 'weekId') || get(currentWeek, 'weekId')),
    year: leagueChanged ? get(currentWeek, 'year') : (get(query, 'year') || get(currentWeek, 'year')),
    beginDateTime: leagueChanged ? get(currentWeek,'beginDateTime') : get(query, 'beginDateTime') || get(currentWeek,'beginDateTime'),
    endDateTime: leagueChanged ? get(currentWeek,'endDateTime') : get(query, 'endDateTime') || get(currentWeek,'endDateTime'),
    gameType: gameType,
    loading: loading
  };

  await Promise.all([
    !!get(authenticationDomain,'isAuthenticated') ? dispatch(createUser(user)) : undefined,
    dispatch({type: ActionTypes.SCOREBOARD_REQUEST, request})
  ]);

  Promise.all([
    dispatch(fetchGames(request, [ ActionTypes.SCOREBOARD_GAMES_REQUEST, ActionTypes.SCOREBOARD_GAMES_SUCCESS, ActionTypes.SCOREBOARD_GAMES_FAILURE ])), 
    !!get(authenticationDomain,'isAuthenticated') ? dispatch(fetchPicks(request, [ ActionTypes.SCOREBOARD_PICKS_REQUEST, ActionTypes.SCOREBOARD_PICKS_SUCCESS, ActionTypes.SCOREBOARD_PICKS_FAILURE ])) : undefined,
    dispatch(fetchAllTeams([ ActionTypes.TEAMS_REQUEST, ActionTypes.TEAMS_SUCCESS, ActionTypes.TEAMS_FAILURE ]))
  ]).then(result=>{
    dispatch({type: ActionTypes.SCOREBOARD_SUCCESS, response: result});
  });
};

export const loadGamesInProgress = () => (dispatch, getState) => {
  dispatch(fetchGamesInProgress());
};

export const loadGameWeeks = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch(fetchGameWeeks(query));
};

export const loadArticles = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch(fetchArticles());
};

export const loadLeaders = (query, requiredFields = []) => async (dispatch, getState) => {
  const currentState = getState();
  const leagueName = window.location.pathname.split('/')[2];
  const lookup = currentState.get('lookup').toJS();
  const leagues = get(lookup, 'leagues', []);
  const currentLeague = leagues.find(x=>x.name === leagueName);
  const leagueId = currentLeague.id;
  const leagueChanged = get(query, 'leagueId') !== leagueId;
  const gameType = get(query, 'gameType');
  const loading = get(query, 'loading');

  const year = leagueChanged ? last(currentLeague.years) : get(query, 'year');
  let isRollup = leagueChanged ? false : get(query, 'isRollup');

  const gameWeeks = await dispatch(fetchGameWeeks({leagueId,year,isRollup}));
  const weeks = get(gameWeeks,'response',[]);
  const currentWeek = getCurrentWeek(weeks);

  const request = {
    leagueId: leagueId,
    weekId: leagueChanged ? get(currentWeek, 'weekId') : get(query, 'weekId') || get(currentWeek, 'weekId'),
    year: leagueChanged ? get(currentWeek, 'year') : get(query, 'year') || get(currentWeek, 'year'),
    beginDateTime: leagueChanged ? get(currentWeek,'beginDateTime') : get(query, 'beginDateTime') || get(currentWeek,'beginDateTime'),
    endDateTime: leagueChanged ? get(currentWeek,'endDateTime') : get(query, 'endDateTime') || get(currentWeek,'endDateTime'),
    gameType: gameType,
    loading: loading
  };

  dispatch({type: ActionTypes.LEADERS_REQUEST, request});

  isRollup = leagueChanged ? get(currentWeek, 'isRollup') : (get(query, 'isRollup') || get(currentWeek, 'isRollup'));

  Promise.all([
    dispatch(fetchGames(request, [ ActionTypes.LEADER_GAMES_REQUEST, ActionTypes.LEADER_GAMES_REQUEST, ActionTypes.LEADER_GAMES_FAILURE ])), 
    dispatch(fetchPicks(request, [ ActionTypes.LEADER_PICKS_REQUEST, ActionTypes.LEADER_PICKS_SUCCESS, ActionTypes.LEADER_PICKS_FAILURE ])),
    dispatch(fetchAllUsers({isRollup})),
    dispatch(fetchAllTeams([ ActionTypes.TEAMS_REQUEST, ActionTypes.TEAMS_SUCCESS, ActionTypes.TEAMS_FAILURE ]))
  ]).then(
    result=>{ 
      dispatch({type: ActionTypes.LEADERS_SUCCESS, response: {...result, isRollup}});
  });
};
