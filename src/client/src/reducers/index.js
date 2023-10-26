import { combineReducers } from 'redux-immutable';

import {
  articleDomain,
  ui,
  lookup,
} from './reducers';

import { homePageDomain } from './homePage';
import { authenticationDomain } from './authentication';

const rootReducer = combineReducers({
  homePageDomain,
  authenticationDomain,
  articleDomain,
  ui,
  lookup,
});

export default rootReducer;