import { combineReducers } from 'redux-immutable';
import * as ActionTypes from '../actions';
import { getResults } from '../selectors/data';

import { Map, List } from 'immutable';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import orderBy from 'lodash/orderBy';

const users = [
    {
        id: 'google-oauth2|114172296334563495985',
        name: 'Roy B.'
    },
    {
        id: 'google-oauth2|114007081690870704922',
        name: 'Scott T.'
    },
    {
        id: 'google-oauth2|110505723196499693171',
        name: 'Keith H.'
    }
];

const entities = (state = Map({ 
  games: List(), 
  picks: List(), 
  leaders: List(), 
  gameWeeks: List(), 
  authentication: Map({isAuthenticated: false
  }), dataLoading: true }), action) => {
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
    case ActionTypes.PICKS_SUCCESS:
      if (action.response) {
        const pickList = action.response.map(item=>{
          return Map(item);
        });
        return state.set('picks', List(pickList));
      }
      return state;
    case ActionTypes.LEADERS_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.LEADERS_SUCCESS:  
      if (action.response) {
        const gameList = get(action, 'response[0].response', [])
        const pickList = get(action, 'response[1].response', []);
        const grouping = groupBy(pickList, 'userId');

        const picksByUser = transform(grouping, (result, value, key)=>{
            result.push({
                userId: key,
                picks: value
            });
        }, []);

        const pickResults = picksByUser.reduce((total, item) => {
            if (!!users.find(x=>x.id === item.userId)) {
              const pickResult = getResults(gameList,item.picks);
              const user = users.find(x=>x.id === item.userId);

              total.push({
                  id: item.userId,
                  userName: get(user,'name','unknown'),
                  wins: pickResult.wins,
                  losses: pickResult.losses,
                  ties: pickResult.ties
              });
            }

            return total;
        }, []);

        const pickResultsOrdered = orderBy(pickResults, ['wins', 'userName'], ['desc', 'asc']);

        return state.set('leaders', List(pickResultsOrdered)).set("dataLoading", false);
      }
      return state;
    case ActionTypes.LEADERS_FAILURE:
      return state.set('dataLoading', false);
    case ActionTypes.ADDPICK_SUCCESS:
      const pickListWithNewValue = state.get('picks').set(state.get('picks').size, Map(action.response).set("inProgress", false));
      return state.set('picks', pickListWithNewValue)
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
    case ActionTypes.GAMEWEEKS_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.GAMEWEEKS_SUCCESS:
      if (action.response) {
        const gameWeekList = action.response.map(item=>{
          return Map(item);
        });
        return state.set('gameWeeks', List(gameWeekList));
      }
      return state;
    case ActionTypes.GAMEWEEKS_FAILURE:
      return state.set('dataLoading', false);
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