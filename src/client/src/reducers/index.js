import { combineReducers } from 'redux-immutable';

import {
  scoreboardDomain,
  weeksDomain,
  teamDomain,
  articleDomain,
  ui,
  lookup,
  errorMessage
} from './reducers';

import { homePageDomain } from './homePage';
import { authenticationDomain } from './authentication';

const rootReducer = combineReducers({
  homePageDomain,
  authenticationDomain,
  scoreboardDomain,
  weeksDomain,
  teamDomain,
  articleDomain,
  ui,
  lookup,
  errorMessage
});

export default rootReducer;