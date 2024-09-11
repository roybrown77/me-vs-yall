import { Map, List } from 'immutable';

import get from 'lodash/get';

import { 
  leagues
} from '../utilities';

const requestStorageJson = localStorage.getItem('request');
const requestStorage = JSON.parse(requestStorageJson);
const leagueId = get(requestStorage, 'leagueId') || '59723313734d1d6202a85f10';

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