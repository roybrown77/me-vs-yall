import { combineReducers } from 'redux-immutable';

import {
  homePageDomain,
  authenticationDomain,
  scoreboardDomain,
  leaderDomain,
  weeksDomain,
  teamDomain,
  ui,
  lookup,
  errorMessage
} from './reducers';

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