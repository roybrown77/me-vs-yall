import { combineReducers } from 'redux-immutable';

import {
  ui,
  lookup,
} from './reducers';

import { authenticationDomain } from './authentication';

const rootReducer = combineReducers({
  authenticationDomain,
  ui,
  lookup,
});

export default rootReducer;