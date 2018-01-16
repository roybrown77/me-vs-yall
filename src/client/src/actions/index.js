import queryString from 'query-string';
import URLSearchParams from 'url-search-params';

import { CALL_API, Schemas } from '../middleware/api';

export const GAMES_REQUEST = 'GAMES_REQUEST';
export const GAMES_SUCCESS = 'GAMES_SUCCESS';
export const GAMES_FAILURE = 'GAMES_FAILURE';

const fetchGames = query => ({
  [CALL_API]: {
    types: [ GAMES_REQUEST, GAMES_SUCCESS, GAMES_FAILURE ],
    endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

export const loadGames = (query, requiredFields = []) => (dispatch, getState) => {
  return dispatch(fetchGames(query));
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

export const PICKS_REQUEST = 'PICKS_REQUEST';
export const PICKS_SUCCESS = 'PICKS_SUCCESS';
export const PICKS_FAILURE = 'PICKS_FAILURE';

const fetchPicks = query => ({
  [CALL_API]: {
    types: [ PICKS_REQUEST, PICKS_SUCCESS, PICKS_FAILURE ],
    endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
    schema: Schemas.PICK_ARRAY
  }
});

export const loadPicks = (query, requiredFields = []) => (dispatch, getState) => {
  return dispatch(fetchPicks(query));
};

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

export const updatePick = (id, pick) => (dispatch, getState) => {
  const searchParams = new URLSearchParams();
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameId', pick.gameId);

  return dispatch(editPick(id, searchParams));
};

export const selectWeek = (week) => (dispatch, getState) => {
  return dispatch({
    type: 'GAMESEARCHUPDATE',
    week: week
  });
};

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});

export const LEADER_GAMES_REQUEST = 'LEADER_GAMES_REQUEST';
export const LEADER_GAMES_SUCCESS = 'LEADER_GAMES_SUCCESS';
export const LEADER_GAMES_FAILURE = 'LEADER_GAMES_FAILURE';

export const LEADER_PICKS_REQUEST = 'LEADER_PICKS_REQUEST';
export const LEADER_PICKS_SUCCESS = 'LEADER_PICKS_SUCCESS';
export const LEADER_PICKS_FAILURE = 'LEADER_PICKS_FAILURE';

const fetchLeaderGames = query => ({
  [CALL_API]: {
    types: [ LEADER_GAMES_REQUEST, LEADER_GAMES_SUCCESS, LEADER_GAMES_FAILURE ],
    endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
    schema: Schemas.GAME_ARRAY
  }
});

const fetchLeaderPicks = query => ({
  [CALL_API]: {
    types: [ LEADER_PICKS_REQUEST, LEADER_PICKS_SUCCESS, LEADER_PICKS_FAILURE ],
    endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
    schema: Schemas.PICK_ARRAY
  }
});

export const LEADERS_REQUEST = 'LEADERS_REQUEST';
export const LEADERS_SUCCESS = 'LEADERS_SUCCESS';
export const LEADERS_FAILURE = 'LEADERS_FAILURE';

export const loadLeaders = (query, requiredFields = []) => (dispatch, getState) => {
  dispatch({type: LEADERS_REQUEST});

  return Promise.all([
      dispatch(fetchLeaderGames(query)), 
      dispatch(fetchLeaderPicks(query))
    ]).then(
    result=>{ 
      dispatch({type: LEADERS_SUCCESS, response: result});
    },
    error=>{
      dispatch({type: LEADERS_FAILURE});
    }
  );
};