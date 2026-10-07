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
const POST_LOGIN_REDIRECT_KEY = 'postLoginRedirect';
const DEFAULT_POST_LOGIN_PATH = '/scoreboards/nfl';

const savePostLoginRedirect = () => {
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (!path.startsWith('/') || path.startsWith('//')) {
    return;
  }

  if (
    path.startsWith('/authenticationCallback') ||
    path.startsWith('/login')
  ) {
    return;
  }

  localStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
};

export const consumePostLoginRedirect = () => {
  const path = localStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return DEFAULT_POST_LOGIN_PATH;
  }

  if (
    path.startsWith('/authenticationCallback') ||
    path.startsWith('/login')
  ) {
    return DEFAULT_POST_LOGIN_PATH;
  }

  return path;
};

const auth = new auth0.WebAuth({
  clientID: authenticationClientId,
  domain: CLIENT_DOMAIN,
  responseType: RESPONSE_TYPE,
  redirectUri: window.location.protocol + "//" + window.location.hostname + (window.location.port !== "" ? ":" + window.location.port : "") + "/authenticationCallback",
  audience: AUDIENCE,
  scope: SCOPE
});

export const autoGoogleLogin = () => {
  savePostLoginRedirect();
  try {
    auth.authorize({
      connection: 'google-oauth2',
      prompt: 'none'
    });
  } catch {
    localStorage.setItem('confirmedContinueAuthenticationTime', moment().add(3,'hours').toISOString());
    window.location.reload();
  }
};

export const googleLogin = () => {
  savePostLoginRedirect();
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
  window.location.href = '/';
};

export const isLoggedIn = () => {
  const idToken = getIdToken();
  const tokenExpired = !isTokenExpired();
  const result = !!idToken && !tokenExpired;
  return result;
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

export const cacheUserFromIdToken = () => {
  const idToken = getIdToken();
  if (!idToken) {
    return null;
  }

  try {
    const payload = idToken.split('.')[1];
    if (!payload) {
      return null;
    }

    const claims = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );

    const user = {
      sub: claims.sub,
      name: claims.name,
      picture: claims.picture,
      email: claims.email,
      given_name: claims.given_name,
      family_name: claims.family_name,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
};

export const getUser = () => {
  const userString = localStorage.getItem(USER_KEY);
  try {
    return JSON.parse(userString);
  } catch {
    localStorage.setItem('confirmedContinueAuthenticationTime', moment().add(3,'hours').toISOString());
    return {};
  }
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