//import auth0 from 'auth0-js';
//import { AUTH_CONFIG } from './auth0-variables';
//import history from './history';

// const AUTH_CONFIG = {
//   domain: 'mevsyall.auth0.com',
//   clientId: 'CMVmcCBsvBpB7Q9vxK7311G9lG7Ikd3d',
//   callbackUrl: 'http://localhost:3000/callback',
//   apiUrl: 'https://mevsyallcom/api/'
// };

// export default class Auth {
//   auth0 = new auth0.WebAuth({
//     domain: AUTH_CONFIG.domain,
//     clientID: AUTH_CONFIG.clientId,
//     redirectUri: AUTH_CONFIG.callbackUrl,
//     audience: AUTH_CONFIG.apiUrl,
//     responseType: 'token id_token',
//     scope: 'openid'
//   });

//   userProfile;

//   constructor() {
//     this.login = this.login.bind(this);
//     this.logout = this.logout.bind(this);
//     this.handleAuthentication = this.handleAuthentication.bind(this);
//     this.isAuthenticated = this.isAuthenticated.bind(this);
//     this.getAccessToken = this.getAccessToken.bind(this);
//     this.getProfile = this.getProfile.bind(this);
//   }

//   login() {
//     this.auth0.authorize();
//   }

//   handleAuthentication() {
//     this.auth0.parseHash((err, authResult) => {
//       if (authResult && authResult.accessToken && authResult.idToken) {
//         this.setSession(authResult);
//         history.replace('/home');
//       } else if (err) {
//         history.replace('/home');
//         console.log(err);
//         alert(`Error: ${err.error}. Check the console for further details.`);
//       }
//     });
//   }

//   setSession(authResult) {
//     // Set the time that the access token will expire at
//     let expiresAt = JSON.stringify(
//       authResult.expiresIn * 1000 + new Date().getTime()
//     );
//     localStorage.setItem('access_token', authResult.accessToken);
//     localStorage.setItem('id_token', authResult.idToken);
//     localStorage.setItem('expires_at', expiresAt);
//     // navigate to the home route
//     history.replace('/home');
//   }

//   getAccessToken() {
//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       throw new Error('No access token found');
//     }
//     return accessToken;
//   }

//   getProfile(cb) {
//     let accessToken = this.getAccessToken();
//     this.auth0.client.userInfo(accessToken, (err, profile) => {
//       if (profile) {
//         this.userProfile = profile;
//       }
//       cb(err, profile);
//     });
//   }

//   logout() {
//     // Clear access token and ID token from local storage
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('id_token');
//     localStorage.removeItem('expires_at');
//     this.userProfile = null;
//     // navigate to the home route
//     history.replace('/home');
//   }

//   isAuthenticated() {
//     // Check whether the current time is past the 
//     // access token's expiry time
//     let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
//     return new Date().getTime() < expiresAt;
//   }
// }

import decode from 'jwt-decode';
import auth0 from 'auth0-js';
import history from './history';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = 'CMVmcCBsvBpB7Q9vxK7311G9lG7Ikd3d';
const CLIENT_DOMAIN = 'mevsyall.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'openid';
const AUDIENCE = 'https://mevsyallcom/api/';

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
}

export function logout() {
  clearIdToken();
  clearAccessToken();
  history.push('/');
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}