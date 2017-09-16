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

// Fetches data unless it is cached.
// Relies on Redux Thunk middleware.
export const loadGames = (query, requiredFields = []) => (dispatch, getState) => {
  //const games = getState().entities.games; //find by query
  //if (games && requiredFields.every(key => game.hasOwnProperty(key))) {
  //  return null
  //}

  return dispatch(fetchGames(query));
};

export const PICKS_REQUEST = 'PICKS_REQUEST';
export const PICKS_SUCCESS = 'PICKS_SUCCESS';
export const PICKS_FAILURE = 'PICKS_FAILURE';

// Fetches data
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPicks = query => ({
  [CALL_API]: {
    types: [ PICKS_REQUEST, PICKS_SUCCESS, PICKS_FAILURE ],
    endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
    schema: Schemas.PICK_ARRAY
  }
});

// Fetches a data unless it is cached.
// Relies on Redux Thunk middleware.
export const loadPicks = (query, requiredFields = []) => (dispatch, getState) => {
  //const picks = getState().entities.picks; //find by query
  //if (picks && requiredFields.every(key => pick.hasOwnProperty(key))) {
  //  return null
  //}

  return dispatch(fetchPicks(query));
};

export const ADDPICK_REQUEST = 'ADDPICK_REQUEST';
export const ADDPICK_SUCCESS = 'ADDPICK_SUCCESS';
export const ADDPICK_FAILURE = 'ADDPICK_FAILURE';

// Fetches data
// Relies on the custom API middleware defined in ../middleware/api.js.
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

// Fetches data
// Relies on the custom API middleware defined in ../middleware/api.js.
const editPick = (id, pick) => ({
  [CALL_API]: {
    types: [ UPDATEPICK_REQUEST, UPDATEPICK_SUCCESS, UPDATEPICK_FAILURE ],
    endpoint: '/api/pickmanagement/picks/' + encodeURIComponent(id),
    method: 'PUT',
    body: pick,
    schema: Schemas.PICK
  }
});

// Fetches a data unless it is cached.
// Relies on Redux Thunk middleware.
export const addPick = (pick) => (dispatch, getState) => {
  //const picks = getState().entities.picks; //find by query
  //if (picks && requiredFields.every(key => pick.hasOwnProperty(key))) {
  //  return null
  //}

  const searchParams = new URLSearchParams();
  searchParams.set('leagueId', pick.leagueId);
  searchParams.set('weekNo', pick.weekNo);
  searchParams.set('gameId', pick.gameId);
  searchParams.set('pickId', pick.pickId);

  return dispatch(createPick(searchParams));
};

// Fetches a data unless it is cached.
// Relies on Redux Thunk middleware.
export const updatePick = (id, pick) => (dispatch, getState) => {
  //const picks = getState().entities.picks; //find by query
  //if (picks && requiredFields.every(key => pick.hasOwnProperty(key))) {
  //  return null
  //}

  const searchParams = new URLSearchParams();
  searchParams.set('pickId', pick.pickId);
  searchParams.set('gameId', pick.gameId);

  return dispatch(editPick(id, searchParams));
};

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});