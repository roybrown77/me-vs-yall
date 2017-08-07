/* eslint-disable no-undef */
import URLSearchParams from 'url-search-params';
import queryString from 'query-string';

import { getAccessToken, serverLogout } from './AuthService';

function getGames(query, cb) {
    return fetch(`/api/gamemanagement/games?${queryString.stringify(query)}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getPicks(query, cb) {
    return fetch(`/api/pickmanagement/picks?${queryString.stringify(query)}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createPick(pick, cb) {
    const searchParams = new URLSearchParams();
    searchParams.set('leagueId', pick.leagueId);
    searchParams.set('weekNo', pick.weekNo);
    searchParams.set('gameId', pick.gameId);
    searchParams.set('pickId', pick.pickId);

    return fetch(`/api/pickmanagement/picks`, {
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

function updatePick(id, pick, cb) {
    const searchParams = new URLSearchParams();
    searchParams.set('gameId', pick.gameId);
    searchParams.set('pickId', pick.pickId);
    
    var esc = encodeURIComponent;
    
    return fetch(`/api/pickmanagement/picks/` + esc(id), {
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
        serverLogout();
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