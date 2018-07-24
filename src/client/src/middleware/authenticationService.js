import auth0 from 'auth0-js';
import history from './history';
import moment from 'moment';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const EXPIRATION_KEY = 'expires_in';
const USER_KEY = 'user';

const CLIENT_ID = 'CMVmcCBsvBpB7Q9vxK7311G9lG7Ikd3d';
const CLIENT_DOMAIN = 'mevsyall.auth0.com';

const RESPONSE_TYPE = 'token id_token';
const AUDIENCE = 'https://mevsyallcom/api/';
const SCOPE = 'openid profile email';

const auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN,
  responseType: RESPONSE_TYPE,
  redirectUri: window.location.protocol + "//" + window.location.hostname + (window.location.port !== "" ? ":" + window.location.port : "") + "/authenticationCallback",
  audience: AUDIENCE,
  scope: SCOPE
});

export function isLoggedIn() {
  const idToken = getIdToken();
  const tokenExpired = !isTokenExpired();
  const result = !!idToken && !tokenExpired;
  return result;
}

export function googleLogin() {
  auth.authorize({
    connection: 'google-oauth2',
    prompt: 'select_account'
  });
}

export function serverLogout() {
  clearIdToken();
  clearAccessToken();
  history.push('/login');
}

export function logout() {
  localStorage.clear();
  history.push('/');
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function setIdToken() {
  const idToken = getParameterByName(ID_TOKEN_KEY);
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function setAccessToken() {
  const accessToken = getParameterByName(ACCESS_TOKEN_KEY);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setExpiration() {
  const expiresIn = getParameterByName(EXPIRATION_KEY);
  const expiresAt = moment(new Date()).add(expiresIn, 'seconds').format();
  localStorage.setItem(EXPIRATION_KEY, expiresAt);
}

export function getUserProfile(cb) {
  const token = getAccessToken();

  auth.client.userInfo(token, (err, profile) => {
    cb(err, profile);
  });
}

export function getUser() {
  const userString = localStorage.getItem(USER_KEY);
  return JSON.parse(userString);
}

function getTokenExpirationDate() {
  return localStorage.getItem(EXPIRATION_KEY);
}

function isTokenExpired() {
  const expirationDateTimeString = getTokenExpirationDate();
  const expirationDateTime = moment(expirationDateTimeString);
  const currentDateTime = moment(new Date());
  const diff = expirationDateTime.diff(currentDateTime, 'minutes');
  return diff > 0;
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function clearExpiration() {
  localStorage.removeItem(EXPIRATION_KEY);
}

function getParameterByName(name) {
  const match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}