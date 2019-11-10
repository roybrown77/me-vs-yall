import queryString from 'query-string';
import URLSearchParams from 'url-search-params';
import moment from 'moment-timezone';

import get from 'lodash/get';
import last from 'lodash/last';

import { CALL_API, Schemas } from '../middleware/api';
import { getUserProfile, getUser, setIdToken, setAccessToken, setExpiration } from '../middleware/authenticationService';

export const LEADERS_REQUEST = 'LEADERS_REQUEST';
export const LEADERS_SUCCESS = 'LEADERS_SUCCESS';
export const LEADERS_FAILURE = 'LEADERS_FAILURE';

export const LEADER_GAMES_REQUEST = 'LEADER_GAMES_REQUEST';
export const LEADER_GAMES_SUCCESS = 'LEADER_GAMES_SUCCESS';
export const LEADER_GAMES_FAILURE = 'LEADER_GAMES_FAILURE';

export const LEADER_PICKS_REQUEST = 'LEADER_PICKS_REQUEST';
export const LEADER_PICKS_SUCCESS = 'LEADER_PICKS_SUCCESS';
export const LEADER_PICKS_FAILURE = 'LEADER_PICKS_FAILURE';

export const SCOREBOARD_REQUEST = 'SCOREBOARD_REQUEST';
export const SCOREBOARD_SUCCESS = 'SCOREBOARD_SUCCESS';
export const SCOREBOARD_FAILURE = 'SCOREBOARD_FAILURE';

export const SCOREBOARD_GAMES_REQUEST = 'SCOREBOARD_GAMES_REQUEST';
export const SCOREBOARD_GAMES_SUCCESS = 'SCOREBOARD_GAMES_SUCCESS';
export const SCOREBOARD_GAMES_FAILURE = 'SCOREBOARD_GAMES_FAILURE';

export const SCOREBOARD_PICKS_REQUEST = 'SCOREBOARD_PICKS_REQUEST';
export const SCOREBOARD_PICKS_SUCCESS = 'SCOREBOARD_PICKS_SUCCESS';
export const SCOREBOARD_PICKS_FAILURE = 'SCOREBOARD_PICKS_FAILURE';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';

export const TEAMS_REQUEST = 'TEAMS_REQUEST';
export const TEAMS_SUCCESS = 'TEAMS_SUCCESS';
export const TEAMS_FAILURE = 'TEAMS_FAILURE';

export const CREATEUSER_REQUEST = 'CREATEUSER_REQUEST';
export const CREATEUSER_SUCCESS = 'CREATEUSER_SUCCESS';
export const CREATEUSER_FAILURE = 'CREATEUSER_FAILURE';

export const ADDPICK_REQUEST = 'ADDPICK_REQUEST';
export const ADDPICK_SUCCESS = 'ADDPICK_SUCCESS';
export const ADDPICK_FAILURE = 'ADDPICK_FAILURE';

export const UPDATEPICK_REQUEST = 'UPDATEPICK_REQUEST';
export const UPDATEPICK_SUCCESS = 'UPDATEPICK_SUCCESS';
export const UPDATEPICK_FAILURE = 'UPDATEPICK_FAILURE';

export const GAMEWEEKS_REQUEST = 'GAMEWEEKS_REQUEST';
export const GAMEWEEKS_SUCCESS = 'GAMEWEEKS_SUCCESS';
export const GAMEWEEKS_FAILURE = 'GAMEWEEKS_FAILURE';

export const GAMESINPROGRESS_REQUEST = 'GAMESINPROGRESS_REQUEST';
export const GAMESINPROGRESS_SUCCESS = 'GAMESINPROGRESS_SUCCESS';
export const GAMESINPROGRESS_FAILURE = 'GAMESINPROGRESS_FAILURE';

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

const getCurrentWeek = (weeks = []) => {
    // must check if any games in progress then if have not started to return it as current week
    const currentDateTime = moment();
    const dateFound = weeks.find(x=>currentDateTime.diff(moment(x.startDateTime),'seconds') >= 0 && currentDateTime.diff(moment(x.endDateTime).add(8,'hours'),'seconds') <= 0);
    return dateFound || last(weeks);
};

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});

const createUser = profile => ({
  [CALL_API]: {
    types: [ CREATEUSER_REQUEST, CREATEUSER_SUCCESS, CREATEUSER_FAILURE ],
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
  });
};

export const selectWeek = (week) => (dispatch, getState) => {
  dispatch({
    type: 'GAMESEARCHUPDATE',
    week
  });
};

const createPick = pick => ({
  [CALL_API]: {
    types: [ ADDPICK_REQUEST, ADDPICK_SUCCESS, ADDPICK_FAILURE ],
    endpoint: '/api/pickmanagement/picks',
    method: 'POST',
    body: pick,
    schema: Schemas.PICK
  }
});

export const addPick = (pick) => (dispatch, getState) => {
  const searchParams = new URLSearchParams();
  const userInSession = getUser();
  const userId = get(userInSession,'sub');
  searchParams.set('userId', userId);
  searchParams.set('gameId', pick.gameId);
  searchParams.set('pickId', pick.pickId);

  dispatch(createPick(searchParams));
};

const editPick = (id, pick) => ({
  id,
  [CALL_API]: {
    types: [ UPDATEPICK_REQUEST, UPDATEPICK_SUCCESS, UPDATEPICK_FAILURE ],
    endpoint: '/api/pickmanagement/picks/' + encodeURIComponent(id),
    method: 'PUT',
    body: pick,
    schema: Schemas.PICK
  }
});

export const updatePick = (id, pick) => (dispatch, getState) => {
  const userInSession = getUser();
  const userId = get(userInSession,'sub');
  const searchParams = new URLSearchParams();
  searchParams.set('userId', userId);
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameId', pick.gameId);

  dispatch(editPick(id, searchParams));
};

const fetchGamesInProgress = () => ({
  [CALL_API]: {
    types: [ GAMESINPROGRESS_REQUEST, GAMESINPROGRESS_SUCCESS, GAMESINPROGRESS_FAILURE ],
    endpoint: `/api/gamemanagement/gamesInProgress`,
    schema: Schemas.GAME_ARRAY
  }
});

export const loadGamesInProgress = () => (dispatch, getState) => {
  dispatch(fetchGamesInProgress());
};

const fetchGameWeeks = query => ({
  [CALL_API]: {
    types: [ GAMEWEEKS_REQUEST, GAMEWEEKS_SUCCESS, GAMEWEEKS_FAILURE ],
    endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

export const loadGameWeeks = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch(fetchGameWeeks(query));
};

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
    types: [ USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE ],
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

export const loadScoreboard = (query, requiredFields = []) => (dispatch, getState) => {
  const leagueId = get(query,'leagueId');
  const year = get(query, 'year');

  dispatch(fetchGameWeeks({leagueId,year})).then(
    result=>{
        const currentState = getState();
        const authenticationDomain = currentState.get('authenticationDomain').toJS();
        const userInSession = getUser();
        const user = get(authenticationDomain,'user',userInSession);
        const weeks = get(result,'response',[]);
        const currentWeek = getCurrentWeek(weeks);

        const request = {
          weekId: get(query, 'weekId') || get(currentWeek, 'weekId'),
          userId: get(user,'sub'),
          leagueId: get(query, 'leagueId')  || get(currentWeek, 'leagueId'),
          year: get(query, 'year') || get(currentWeek, 'year'),
          beginDateTime: get(query, 'beginDateTime') || get(currentWeek,'beginDateTime'),
          endDateTime: get(query, 'endDateTime') || get(currentWeek,'endDateTime')
        };

        const requestStorageJson = localStorage.getItem('request');
        const requestStorage = JSON.parse(requestStorageJson);

        if (get(request, 'leagueId') !== get(requestStorage, 'leagueId')) {
          const lookup = currentState.get('lookup').toJS();
          const leagues = get(lookup, 'leagues', []);
          const leagueId = get(request, 'leagueId');
          const league = leagues.find(x=>x.id === leagueId);
          const leagueName = get(league,'name','nfl');
        }

        Promise.all([
          !!get(authenticationDomain,'isAuthenticated') ? dispatch(createUser(user)) : undefined,
          dispatch({type: SCOREBOARD_REQUEST, request})
        ]).then(
            Promise.all([
              dispatch(fetchGames(request, [ SCOREBOARD_GAMES_REQUEST, SCOREBOARD_GAMES_SUCCESS, SCOREBOARD_GAMES_FAILURE ])), 
              !!get(authenticationDomain,'isAuthenticated') ? dispatch(fetchPicks(request, [ SCOREBOARD_PICKS_REQUEST, SCOREBOARD_PICKS_SUCCESS, SCOREBOARD_PICKS_FAILURE ])) : undefined,
              dispatch(fetchAllTeams([ TEAMS_REQUEST, TEAMS_SUCCESS, TEAMS_FAILURE ]))
            ]).then(
              result=>{ 
                dispatch({type: SCOREBOARD_SUCCESS, response: result});
              },
              error=>{
                dispatch({type: SCOREBOARD_FAILURE});
            })
          );
    },
    error=>{
        dispatch({type: SCOREBOARD_FAILURE});
    });
};

export const loadLeaders = (query, requiredFields = []) => (dispatch, getState) => {
  const leagueId = get(query,'leagueId');
  const year = get(query, 'year');
  const isRollup = get(query, 'isRollup');

  dispatch(fetchGameWeeks({leagueId,year,isRollup})).then(result=>{
    const weeks = get(result,'response',[]);
    const currentWeek = getCurrentWeek(weeks);

    const request = {
      weekId: get(query, 'weekId') || get(currentWeek, 'weekId'),
      leagueId: get(query, 'leagueId') || get(currentWeek, 'leagueId'),
      year: get(query, 'year') || get(currentWeek, 'year'),
      beginDateTime: get(query, 'beginDateTime') || get(currentWeek,'beginDateTime'),
      endDateTime: get(query, 'endDateTime') || get(currentWeek,'endDateTime')
    };

    const requestStorageJson = localStorage.getItem('request');
    const requestStorage = JSON.parse(requestStorageJson);

    if (get(request, 'leagueId') !== get(requestStorage, 'leagueId')) {
      const currentState = getState();
      const lookup = currentState.get('lookup').toJS();
      const leagues = get(lookup, 'leagues', []);
      const leagueId = get(request, 'leagueId');
      const league = leagues.find(x=>x.id === leagueId);
      const leagueName = get(league,'name','nfl');
    }

    dispatch({type: LEADERS_REQUEST, request});

    Promise.all([
      dispatch(fetchGames(request, [ LEADER_GAMES_REQUEST, LEADER_GAMES_REQUEST, LEADER_GAMES_FAILURE ])), 
      dispatch(fetchPicks(request, [ LEADER_PICKS_REQUEST, LEADER_PICKS_SUCCESS, LEADER_PICKS_FAILURE ])),
      dispatch(fetchAllUsers({isRollup})),
      dispatch(fetchAllTeams([ TEAMS_REQUEST, TEAMS_SUCCESS, TEAMS_FAILURE ]))
    ]).then(
    result=>{ 
      dispatch({type: LEADERS_SUCCESS, response: result});
    },
    error=>{
      dispatch({type: LEADERS_FAILURE});
    });
    },
    error=>{
      dispatch({type: LEADERS_FAILURE});
    });
};
