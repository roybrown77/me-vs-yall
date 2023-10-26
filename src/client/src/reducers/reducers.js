import { Map, List } from 'immutable';

import get from 'lodash/get';

import { ActionTypes } from '../actions';

import { 
  leagues
} from '../utilities';

const requestStorageJson = localStorage.getItem('request');
const requestStorage = JSON.parse(requestStorageJson);
const leagueId = get(requestStorage, 'leagueId') || '59723313734d1d6202a85f10';

export const articleDomain = (
  state = Map({ 
    articles: List(), 
    dataLoading: false 
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.ARTICLES_REQUEST:
      return state.set('dataLoading', true);
    case ActionTypes.ARTICLES_SUCCESS:
      if (action.response) {
        const articleList = action.response.map(item=>{
          return Map(item);
        });

        return state.set('articles', List(articleList)).set("dataLoading", false);
      }
      return state;
    case ActionTypes.ARTICLES_FAILURE:
      return state.set('dataLoading', false);
    default:
      return state;
  }
};

export const ui = (state = Map({
  request: Map({
    leagueId,
  })
}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const lookup = (state = Map({leagues}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};