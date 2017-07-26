/* eslint-disable no-undef */
import URLSearchParams from 'url-search-params';

function getGames(query, cb) {
    return fetch(`/api/games?q=${query}`, {
        accept: "application/json"
    })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createPick(body, cb) {
    const searchParams = new URLSearchParams();
    searchParams.set('userId', body.userId);
    searchParams.set('gameId', body.gameId);
    searchParams.set('pickId', body.pickId);

    return fetch(`/api/picks`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
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
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}

const api = { getGames, createPick };

export default api;