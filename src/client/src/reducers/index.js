import { combineReducers } from 'redux-immutable';
import * as ActionTypes from '../actions';
import { routerReducer as routing } from 'react-router-redux';
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

const createPick = (state = Map({ picks: List([]) }), action) => {
  switch (action.type) {
    //case ActionTypes.PICKS_REQUEST:
    case ActionTypes.ADDPICK_SUCCESS:
      return state.picks.push(Map(action.response));
    //case ActionTypes.GAMES_FAILURE:
    default:
      return state;
  }
};

const updatePick = (state = Map({ picks: List([]) }), action) => {
  switch (action.type) {
    //case ActionTypes.PICKS_REQUEST:
    case ActionTypes.UPDATEPICK_SUCCESS:
      return state.get('picks').update(
        state.get('picks').findIndex(function(pick) { 
          return pick.get("_id") === action.response._id;
        }), function(pick) {
          return pick.set("pickId", action.response.pickId);
        }
      );
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

const rootReducer = combineReducers({
	games,
  picks,
  createPick,
  updatePick,
	errorMessage,
  routing
});

export default rootReducer;