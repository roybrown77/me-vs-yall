import queryString from 'query-string';
import URLSearchParams from 'url-search-params';

import get from 'lodash/get';
import last from 'lodash/last';

import { CALL_API, Schemas } from '../middleware/api';
import { leagues } from '../selectors/data';
import { getUserProfile, getUser } from '../middleware/authenticationService';

export const loadUser = () => (dispatch, getState) => {
  return getUserProfile((err, profile) => {
    localStorage.setItem('user', JSON.stringify(profile));
    Promise.all([
      dispatch({
        type: 'LOGIN_SUCCESS',
        user: profile
      })
    ]);
  });
};

export const selectWeek = (week) => (dispatch, getState) => {
  return dispatch({
    type: 'GAMESEARCHUPDATE',
    week
  });
};

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});

export const ADDPICK_REQUEST = 'ADDPICK_REQUEST';
export const ADDPICK_SUCCESS = 'ADDPICK_SUCCESS';
export const ADDPICK_FAILURE = 'ADDPICK_FAILURE';

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
  searchParams.set('leagueId', pick.leagueId);
  searchParams.set('year', pick.year);
  searchParams.set('seasonType', pick.seasonType);
  searchParams.set('weekNo', pick.weekNo);
  searchParams.set('gameId', pick.gameId);
  searchParams.set('pickId', pick.pickId);

  return dispatch(createPick(searchParams));
};

export const UPDATEPICK_REQUEST = 'UPDATEPICK_REQUEST';
export const UPDATEPICK_SUCCESS = 'UPDATEPICK_SUCCESS';
export const UPDATEPICK_FAILURE = 'UPDATEPICK_FAILURE';

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
  const searchParams = new URLSearchParams();
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameId', pick.gameId);

  return dispatch(editPick(id, searchParams));
};

export const GAMEWEEKS_REQUEST = 'GAMEWEEKS_REQUEST';
export const GAMEWEEKS_SUCCESS = 'GAMEWEEKS_SUCCESS';
export const GAMEWEEKS_FAILURE = 'GAMEWEEKS_FAILURE';

const fetchGameWeeks = query => ({
  [CALL_API]: {
    types: [ GAMEWEEKS_REQUEST, GAMEWEEKS_SUCCESS, GAMEWEEKS_FAILURE ],
    endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

export const loadGameWeeks = (query, requiredFields = []) => (dispatch, getState) => {
  return dispatch(fetchGameWeeks(query));
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

export const LEADERS_REQUEST = 'LEADERS_REQUEST';
export const LEADERS_SUCCESS = 'LEADERS_SUCCESS';
export const LEADERS_FAILURE = 'LEADERS_FAILURE';

export const LEADER_GAMES_REQUEST = 'LEADER_GAMES_REQUEST';
export const LEADER_GAMES_SUCCESS = 'LEADER_GAMES_SUCCESS';
export const LEADER_GAMES_FAILURE = 'LEADER_GAMES_FAILURE';

export const LEADER_PICKS_REQUEST = 'LEADER_PICKS_REQUEST';
export const LEADER_PICKS_SUCCESS = 'LEADER_PICKS_SUCCESS';
export const LEADER_PICKS_FAILURE = 'LEADER_PICKS_FAILURE';

export const loadLeaders = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch({type: LEADERS_REQUEST});

  return Promise.all([
      dispatch(fetchGames(query, [ LEADER_GAMES_REQUEST, LEADER_GAMES_SUCCESS, LEADER_GAMES_FAILURE ])), 
      dispatch(fetchPicks(query, [ LEADER_PICKS_REQUEST, LEADER_PICKS_SUCCESS, LEADER_PICKS_FAILURE ]))
    ]).then(
    result=>{ 
      dispatch({type: LEADERS_SUCCESS, response: result});
    },
    error=>{
      dispatch({type: LEADERS_FAILURE});
    }
  );
};

export const SCOREBOARD_REQUEST = 'SCOREBOARD_REQUEST';
export const SCOREBOARD_SUCCESS = 'SCOREBOARD_SUCCESS';
export const SCOREBOARD_FAILURE = 'SCOREBOARD_FAILURE';

export const SCOREBOARD_GAMES_REQUEST = 'SCOREBOARD_GAMES_REQUEST';
export const SCOREBOARD_GAMES_SUCCESS = 'SCOREBOARD_GAMES_SUCCESS';
export const SCOREBOARD_GAMES_FAILURE = 'SCOREBOARD_GAMES_FAILURE';

export const SCOREBOARD_PICKS_REQUEST = 'SCOREBOARD_PICKS_REQUEST';
export const SCOREBOARD_PICKS_SUCCESS = 'SCOREBOARD_PICKS_SUCCESS';
export const SCOREBOARD_PICKS_FAILURE = 'SCOREBOARD_PICKS_FAILURE';

export const loadScoreboard = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch({type: SCOREBOARD_REQUEST});

  const leagueId = get(query,'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;

  return dispatch(fetchGameWeeks({leagueId})).then(result=>{
    const weeksDomain = getState().get('weeksDomain').toJS();
    const mostRecentWeek = last(get(weeksDomain,'gameWeeks'));
    const ui = getState().get('ui').toJS();
    const selectedWeek = last(get(ui,'week'));
    const currentWeek = selectedWeek || mostRecentWeek;
    const user = JSON.parse(getUser());

    const initialQuery = {
      userId: get(user,'sub'),
      leagueId: get(currentWeek, 'leagueId'),
      year: get(currentWeek, 'year'),
      seasonType: get(currentWeek, 'seasonType'),
      weekNo: get(currentWeek, 'weekNo')
    };

    Promise.all([
      dispatch(fetchGames(query || initialQuery, [ SCOREBOARD_GAMES_REQUEST, SCOREBOARD_GAMES_SUCCESS, SCOREBOARD_GAMES_FAILURE ])), 
      dispatch(fetchPicks(query || initialQuery, [ SCOREBOARD_PICKS_REQUEST, SCOREBOARD_PICKS_SUCCESS, SCOREBOARD_PICKS_FAILURE ]))
    ]).then(
    result=>{ 
      dispatch({type: SCOREBOARD_SUCCESS, response: result});
    },
    error=>{
      dispatch({type: SCOREBOARD_FAILURE});
    });
    },
    error=>{
      dispatch({type: SCOREBOARD_FAILURE});
    });
};