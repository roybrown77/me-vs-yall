import { combineReducers } from 'redux-immutable';
import { Map, List } from 'immutable';

import get from 'lodash/get';

import * as ActionTypes from '../actions';

import { 
  leagues, 
  getLeaders,
  getVegasPicks
} from '../utilities';

import { getUser, isLoggedIn } from '../middleware/authenticationClient';

const scoreboardDomain = (
  state = Map({ 
    leagueId: '59723313734d1d6202a85f10',
    games: List(), 
    picks: List(),
    dataLoading: false
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.SCOREBOARD_REQUEST:
      return state.set('dataLoading', true).set('leagueId', get(action,'request.leagueId'));
    case ActionTypes.SCOREBOARD_SUCCESS:
      if (action.response) {
        const gameList = get(action, 'response[0].response', []).map(item=>{
          return Map(item);
        });
        const pickList = get(action, 'response[1].response', []).map(item=>{
          return Map(item);
        });

        return state.set('games', List(gameList)).set('picks', List(pickList)).set('dataLoading', false);
      }
      return state;
    case ActionTypes.SCOREBOARD_FAILURE:
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
            return item.get("gameId") === action.response.gameId; 
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

const authenticationDomain = (
  state = Map({ 
    isAuthenticated: isLoggedIn(), 
    dataLoading: false,
    user: Map(getUser())
  }), 
  action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return state.set('dataLoading', true).set('isAuthenticated', false);
    case 'LOGIN_SUCCESS':
      return state.set('user', Map(get(action, 'user'))).set('dataLoading', false).set('isAuthenticated', true);
    case 'LOGIN_FAILURE':
      return state.set('dataLoading', false);
    default:
      return state;
  }
};

const weeksDomain = (
  state = Map({ 
    gameWeeks: List(), 
    dataLoading: false 
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.GAMEWEEKS_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.GAMEWEEKS_SUCCESS:
      if (action.response) {
        const gameWeekList = action.response.map(item=>{
          return Map(item);
        });

        return state.set('gameWeeks', List(gameWeekList)).set("dataLoading", false);
      }
      return state;
    case ActionTypes.GAMEWEEKS_FAILURE:
      return state.set('dataLoading', false);
    default:
      return state;
  }
};

const teamDomain = (
  state = Map({ 
    teams: List(), 
    dataLoading: false 
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.TEAMS_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.TEAMS_SUCCESS:
      if (action.response) {
        const teamList = action.response.map(item=>{
          return Map(item);
        });

        return state.set('teams', List(teamList)).set("dataLoading", false);
      }
      return state;
    case ActionTypes.TEAMS_FAILURE:
      return state.set('dataLoading', false);
    default:
      return state;
  }
};

const leaderDomain = (
  state = Map({ 
    leagueId: '59723313734d1d6202a85f10',
    leaders: List(), 
    dataLoading: false
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.LEADERS_REQUEST:
      return state.set('dataLoading', true).set('leagueId', get(action,'request.leagueId'));
    case ActionTypes.LEADERS_SUCCESS:  
      if (action.response) {
        const gameList = get(action, 'response[0].response', []);
        const pickList = get(action, 'response[1].response', []);
        const userList = get(action, 'response[2].response', []);
        const teamList = get(action, 'response[3].response', []);
        const isRollup = get(action, 'response.isRollup', false);

        const sortedGames = gameList.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        const picks = [...pickList, ...getVegasPicks(sortedGames)];

        const leaderList = getLeaders(sortedGames, picks, userList, teamList, isRollup);

        return state.set('gameList', List(sortedGames))
        .set('pickList', List(pickList))
        .set('userList', List(userList))
        .set('leaderList', List(leaderList))
        .set("isRollup", isRollup)
        .set("dataLoading", false);
      }
      return state;
    case ActionTypes.LEADERS_FAILURE:
      return state.set('dataLoading', false);
    default:
      return state;
  }
};

const homePageDomain = (
  state = Map({ 
    games: List()
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.GAMESINPROGRESS_SUCCESS:
      if (action.response) {
        const gameList = action.response.map(item=>{
          return Map(item);
        });

        return state.set('games', List(gameList));
      }
      return state;
    default:
      return state;
  }
};

const ui = (state = Map({
  request: Map({
    leagueId: '59723313734d1d6202a85f10',
    showGameDetails: true
  })
}), action) => {
  switch (action.type) {
    case 'SCOREBOARD_REQUEST':
      localStorage.setItem('request', JSON.stringify(get(action, 'request', {})));
      return state.set('request', get(action, 'request'));
    case 'LEADERS_REQUEST':
      localStorage.setItem('request', JSON.stringify(get(action, 'request', {})));
      return state.set('request', get(action, 'request'));
    case 'GAMESHOWDETAILS':
      localStorage.setItem('showGameDetails', get(action, 'flag'));
      return state.set('showGameDetails', get(action, 'flag'));
    default:
      return state;
  }
};

const lookup = (state = Map({leagues}), action) => {
  switch (action.type) {
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
  homePageDomain,
  authenticationDomain,
  scoreboardDomain,
  leaderDomain,
  weeksDomain,
  teamDomain,
  ui,
  lookup,
	errorMessage
});

export default rootReducer;