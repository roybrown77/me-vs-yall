import { CALL_API, Schemas } from '../middleware/api'
// import URLSearchParams from 'url-search-params';
import queryString from 'query-string';

export const GAMES_REQUEST = 'GAMES_REQUEST'
export const GAMES_SUCCESS = 'GAMES_SUCCESS'
export const GAMES_FAILURE = 'GAMES_FAILURE'

// const query = {
//             leagueId:"59723313734d1d6202a85f10",
//             weekNo: week.weekNo
//         };

// const getGamesPromise = api.getGames(query);
// const getPickPromise = api.getPicks(query);

// Fetches data
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchGames = query => ({
  [CALL_API]: {
    types: [ GAMES_REQUEST, GAMES_SUCCESS, GAMES_FAILURE ],
    endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
    schema: Schemas.GAMES
  }
})

// Fetches data unless it is cached.
// Relies on Redux Thunk middleware.
export const loadGames = (query, requiredFields = []) => (dispatch, getState) => {
  //const games = getState().entities.games; //find by query
  //if (games && requiredFields.every(key => game.hasOwnProperty(key))) {
  //  return null
  //}

  return dispatch(fetchGames(query))
}

export const PICKS_REQUEST = 'PICKS_REQUEST'
export const PICKS_SUCCESS = 'PICKS_SUCCESS'
export const PICKS_FAILURE = 'PICKS_FAILURE'

// Fetches data
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPicks = query => ({
  [CALL_API]: {
    types: [ PICKS_REQUEST, PICKS_SUCCESS, PICKS_FAILURE ],
    endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
    schema: Schemas.PICKS
  }
})

// Fetches a data unless it is cached.
// Relies on Redux Thunk middleware.
export const loadPicks = (query, requiredFields = []) => (dispatch, getState) => {
  //const picks = getState().entities.picks; //find by query
  //if (picks && requiredFields.every(key => pick.hasOwnProperty(key))) {
  //  return null
  //}

  return dispatch(fetchPicks(query))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})
