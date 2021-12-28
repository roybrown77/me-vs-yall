import { Map } from 'immutable';
import get from 'lodash/get';

import { ActionTypes } from '../actions';
import { getUser, isLoggedIn } from '../middleware/authenticationClient';

export const authenticationDomain = (
  state = Map({ 
    isAuthenticated: isLoggedIn(), 
    dataLoading: false,
    user: Map(getUser())
  }), 
  action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return state.set('dataLoading', true).set('isAuthenticated', false);
    case ActionTypes.LOGIN_SUCCESS:
      return state.set('user', Map(get(action, 'user'))).set('dataLoading', false).set('isAuthenticated', true);
    case ActionTypes.LOGIN_FAILURE:
      return state.set('dataLoading', false);
    default:
      return state;
  }
};