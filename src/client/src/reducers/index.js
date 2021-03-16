import { combineReducers } from 'redux-immutable';

import {
  authenticationDomain,
  scoreboardDomain,
  leaderDomain,
  weeksDomain,
  teamDomain,
  articleDomain,
  ui,
  lookup,
  errorMessage
} from './reducers';

import { homePageDomain } from './homePage';

const rootReducer = combineReducers({
  homePageDomain,
  authenticationDomain,
  scoreboardDomain,
  leaderDomain,
  weeksDomain,
  teamDomain,
  articleDomain,
  ui,
  lookup,
  errorMessage
});

export default rootReducer;