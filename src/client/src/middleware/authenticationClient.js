import auth0 from 'auth0-js';
import moment from 'moment-timezone';
import {createBrowserHistory} from 'history';
import {authenticationClientId} from '../config';

const history = createBrowserHistory({forceRefresh: true});

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const EXPIRATION_KEY = 'expires_in';
const USER_KEY = 'user';

const CLIENT_DOMAIN = 'mevsyall.auth0.com';

const RESPONSE_TYPE = 'token id_token';
const AUDIENCE = 'https://mevsyallcom/api/';
const SCOPE = 'openid profile email';

const WAIT_FOR_NEXT_SIGN_IN_PROMPT = 1; // hours

const auth = new auth0.WebAuth({
  clientID: authenticationClientId,
  domain: CLIENT_DOMAIN,
  responseType: RESPONSE_TYPE,
  redirectUri: window.location.protocol + "//" + window.location.hostname + (window.location.port !== "" ? ":" + window.location.port : "") + "/authenticationCallback",
  audience: AUDIENCE,
  scope: SCOPE
});

export const autoGoogleLogin = () => {
  try {
    auth.authorize({
      connection: 'google-oauth2',
      prompt: 'none'
    });
  } catch {
    localStorage.setItem('confirmedContinueAuthenticationTime', moment().add(24,'hours').toISOString());
    window.location.reload();
  }
};

export const googleLogin = () => {
  setConfirmedContinueAuthentication(true);
  auth.authorize({
    connection: 'google-oauth2',
    prompt: 'select_account'
  });
};

export const serverLogout = () => {
  clearIdToken();
  clearAccessToken();
  history.push('/login');
};

export const logout = () => {
  localStorage.clear();
  history.push('/');
};

export const isLoggedIn = () => {
  const idToken = getIdToken();
  const tokenExpired = !isTokenExpired();
  const result = !!idToken && !tokenExpired;
  return result;
};

export const requireAuth = (nextState, replace) => {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
};

export const setConfirmedContinueAuthentication = (value) => {
  return localStorage.setItem('confirmedContinueAuthentication', value ? '1' : '0');
};

export const isConfirmedContinueAuthentication = () => {
  return localStorage.getItem('confirmedContinueAuthentication') === '1';
};

export const setIdToken = () => {
  const idToken = getParameterByName(ID_TOKEN_KEY);
  localStorage.setItem(ID_TOKEN_KEY, idToken);
};

export const getIdToken = () => {
  return localStorage.getItem(ID_TOKEN_KEY);
};

export const setAccessToken = () => {
  const accessToken = getParameterByName(ACCESS_TOKEN_KEY);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setExpiration = () => {
  const expiresIn = getParameterByName(EXPIRATION_KEY);
  const expiresAt = moment(new Date()).add(expiresIn, 'seconds').format();
  localStorage.setItem(EXPIRATION_KEY, expiresAt);
};

const getTokenExpirationDate = () => {
  return localStorage.getItem(EXPIRATION_KEY);
};

const isTokenExpired = () => {
  const expirationDateTimeString = getTokenExpirationDate();
  const expirationDateTime = moment(expirationDateTimeString);
  const currentDateTime = moment(new Date());
  const diff = expirationDateTime.diff(currentDateTime, 'minutes');
  return diff > 0;
};

export const getUserProfile = (cb) => {
  const token = getAccessToken();

  auth.client.userInfo(token, (err, profile) => {
    cb(err, profile);
  });
};

export const getUser = () => {
  const userString = localStorage.getItem(USER_KEY);
  return JSON.parse(userString);
};

const clearIdToken = () => {
  localStorage.removeItem(ID_TOKEN_KEY);
};

const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const getParameterByName = (name) => {
  const match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

export const continueAuthentication = (value) => {
  if (value === false) {
      localStorage.clear();
      localStorage.setItem('confirmedContinueAuthenticationTime', moment().toISOString());
      setConfirmedContinueAuthentication(false);
  } else {
      setConfirmedContinueAuthentication(true);
      window.location.reload();
  }
}

export const waitForAuth = () => {
  const lastAuthTime = localStorage.getItem('confirmedContinueAuthenticationTime') || moment().add(-2,'hours').toISOString();
  localStorage.setItem('confirmedContinueAuthenticationTime', lastAuthTime);
  const lastAuthTimeDiff =  moment().diff(moment(lastAuthTime),'hours');
  return lastAuthTimeDiff < WAIT_FOR_NEXT_SIGN_IN_PROMPT;
}

export const isConfirmedAuthentication = () => {
  return isLoggedIn() && isConfirmedContinueAuthentication();
};