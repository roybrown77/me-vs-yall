/* eslint-disable no-undef */
import URLSearchParams from 'url-search-params';
import { login, getAccessToken } from './AuthService';

function getQueryString(params) {
      var esc = encodeURIComponent;
      
      return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
}

function getGames(query, cb) {
    return fetch(`/api/games?${getQueryString(query)}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getPicks(query, cb) {
    return fetch(`/api/picks?${getQueryString(query)}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createPick(body, cb) {
    const searchParams = new URLSearchParams();
    searchParams.set('leagueId', body.leagueId);
    searchParams.set('gameId', body.gameId);
    searchParams.set('pickId', body.pickId);

    return fetch(`/api/picks`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: searchParams
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function updatePick(id, pickId, cb) {
    const searchParams = new URLSearchParams();
    searchParams.set('pickId', pickId);
    
    var esc = encodeURIComponent;
    
    return fetch(`/api/picks/` + esc(id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: searchParams
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    
    if (response.status === 401) {
        login();
        return;
    }

    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}

const api = { getGames, getPicks, updatePick, createPick };

export default api;