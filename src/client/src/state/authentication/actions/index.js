import queryString from 'query-string';
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