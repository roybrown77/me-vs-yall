import { Map, List } from 'immutable';

import * as ActionTypes from '../actions';

export const homePageDomain = (
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