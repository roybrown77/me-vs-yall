import { combineReducers } from 'redux-immutable';

import { authenticationDomain } from './authentication';

const rootReducer = combineReducers({
  authenticationDomain,
});

export default rootReducer;