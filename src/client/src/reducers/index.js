import { combineReducers } from 'redux-immutable';

import {
  articleDomain,
  ui,
  lookup,
} from './reducers';

import { authenticationDomain } from './authentication';

const rootReducer = combineReducers({
  authenticationDomain,
  articleDomain,
  ui,
  lookup,
});

export default rootReducer;