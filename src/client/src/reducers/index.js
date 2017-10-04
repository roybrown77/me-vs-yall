import { combineReducers } from 'redux-immutable';
import * as ActionTypes from '../actions';
//import { routerReducer as routing } from 'react-router-redux';
import { Map, List } from 'immutable';
import get from 'lodash/get';

const entities = (state = Map({ games: List(), picks: List(), dataLoading: true }), action) => {
  switch (action.type) {
    case ActionTypes.GAMES_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.GAMES_SUCCESS:
      if (action.response) {
        const gameList = action.response.map(item=>{
          return Map(item);
        });
        return state.set('games', List(gameList)).set("dataLoading", false);
      }
      return state;
    case ActionTypes.GAMES_FAILURE:
      return state.set('dataLoading', false);
    //case ActionTypes.PICKS_REQUEST:
    case ActionTypes.PICKS_SUCCESS:
      if (action.response) {
        const pickList = action.response.map(item=>{
          return Map(item);
        });
        return state.set('picks', List(pickList));
      }
      return state;
    //case ActionTypes.PICKS_FAILURE:
    //case ActionTypes.ADDPICK_REQUEST:
      // const pickListAddRequest = state.get('picks').update(
      //   state.get('picks').findIndex(function(item) { 
      //       return item.get("_id") === action.id; 
      //     }), function(item) {
      //       return item.set("inProgress", true);
      //     }
      // );
      // return state.set('picks', pickListAddRequest);
    case ActionTypes.ADDPICK_SUCCESS:
      const pickListWithNewValue = state.get('picks').set(state.get('picks').size, Map(action.response).set("inProgress", false));
      return state.set('picks', pickListWithNewValue)
    //case ActionTypes.ADDPICK_FAILURE:
      // const pickListAddFailure = state.get('picks').update(
      //   state.get('picks').findIndex(function(item) { 
      //       return item.get("_id") === action.id; 
      //     }), function(item) {
      //       return item.set("inProgress", false);
      //     }
      // );
      // return state.set('picks', pickListAddFailure);
    case ActionTypes.UPDATEPICK_REQUEST:
      const pickListUpdateRequest = state.get('picks').update(
        state.get('picks').findIndex(function(item) { 
            return item.get("_id") === action.id; 
          }), function(item) {
            return item.set("inProgress", true);
          }
      );
      return state.set('picks', pickListUpdateRequest);
    case ActionTypes.UPDATEPICK_SUCCESS:
      const pickListToUpdate = state.get('picks').update(
        state.get('picks').findIndex(function(item) { 
            return item.get("_id") === action.response._id; 
          }), function(item) {
            return item.set("pickId", action.response.pickId).set("inProgress", false);
          }
      );
      return state.set('picks', pickListToUpdate);
    case ActionTypes.UPDATEPICK_FAILURE:
      const pickListUpdateFailure = state.get('picks').update(
        state.get('picks').findIndex(function(item) { 
            return item.get("_id") === action.id; 
          }), function(item) {
            return item.set("inProgress", false);
          }
      );
      return state.set('picks', pickListUpdateFailure);
    default:
      return state;
  }
};

const ui = (state = Map({weekNo: undefined}), action) => {
  switch (action.type) {
    case 'GAMESEARCHUPDATE_WEEKNO':
      return state.set('weekNo', get(action, 'weekNo'));
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
	entities,
  ui,
	errorMessage
});

export default rootReducer;