import { combineReducers } from 'redux-immutable';
import * as ActionTypes from '../actions';
//import paginate from './paginate';
import { routerReducer as routing } from 'react-router-redux';
//import { combineReducers } from 'redux';
import { Map, List } from 'immutable';

// Updates an entity cache in response to any action with response.entities.
const games = (state = Map({ games: List([]) }), action) => {
  //if (action.response && action.response.entities) {
  switch (action.type) {
    //case ActionTypes.GAMES_REQUEST:
    case ActionTypes.GAMES_SUCCESS:
      return state.set('games', List(action.response));
    //case ActionTypes.GAMES_FAILURE:
    default:
      return state;
  }
};

const picks = (state = Map({ picks: List([]) }), action) => {
  switch (action.type) {
    //case ActionTypes.PICKS_REQUEST:
    case ActionTypes.PICKS_SUCCESS:
      return state.set('picks', List(action.response));
    //case ActionTypes.GAMES_FAILURE:
    default:
      return state;
  }
};

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action;

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return error;
  }

  return state;
};

// const games = (state = { 
//                           isFetching: false,
//                           didInvalidate: false,
//                           items: []
//                         },
//                 action) {
//   switch (action.type) {
//     case INVALIDATE_GAMES:
//       return Object.assign({}, state, {
//         didInvalidate: true
//       })
//     case GAMES_REQUEST:
//       return Object.assign({}, state, {
//         isFetching: true,
//         didInvalidate: false
//       })
//     case GAMES_SUCCESS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         didInvalidate: false,
//         items: action.games,
//         lastUpdated: action.receivedAt
//       })
//     default:
//       return state
//   }
// }

const rootReducer = combineReducers({
	games,
  picks,
	errorMessage,
  routing
});

export default rootReducer;