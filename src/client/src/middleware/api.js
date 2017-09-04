// /* eslint-disable no-undef */
// import URLSearchParams from 'url-search-params';
// import queryString from 'query-string';

// import { getAccessToken, serverLogout } from './AuthService';

// function getGames(query, cb) {
//     return fetch(`/api/gamemanagement/games?${queryString.stringify(query)}`, {
//             headers: {
//                 'Accept': 'application/json'
//             }
//         })
//         .then(checkStatus)
//         .then(parseJSON)
//         .then(cb);
// }

// function getPicks(query, cb) {
//     return fetch(`/api/pickmanagement/picks?${queryString.stringify(query)}`, {
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${getAccessToken()}`
//             }
//         })
//         .then(checkStatus)
//         .then(parseJSON)
//         .then(cb);
// }

// function createPick(pick, cb) {
//     const searchParams = new URLSearchParams();
//     searchParams.set('leagueId', pick.leagueId);
//     searchParams.set('weekNo', pick.weekNo);
//     searchParams.set('gameId', pick.gameId);
//     searchParams.set('pickId', pick.pickId);

//     return fetch(`/api/pickmanagement/picks`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${getAccessToken()}`
//             },
//             body: searchParams
//         })
//         .then(checkStatus)
//         .then(parseJSON)
//         .then(cb);
// }

// function updatePick(id, pick, cb) {
//     const searchParams = new URLSearchParams();
//     searchParams.set('gameId', pick.gameId);
//     searchParams.set('pickId', pick.pickId);
    
//     var esc = encodeURIComponent;
    
//     return fetch(`/api/pickmanagement/picks/` + esc(id), {
//             method: 'PUT',
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${getAccessToken()}`
//             },
//             body: searchParams
//         })
//         .then(checkStatus)
//         .then(parseJSON)
//         .then(cb);
// }

// function checkStatus(response) {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     }
    
//     if (response.status === 401) {
//         serverLogout();
//         return;
//     }

//     const error = new Error(`HTTP Error ${response.statusText}`);
//     error.status = response.statusText;
//     error.response = response;
//     console.log(error); // eslint-disable-line no-console
//     throw error;
// }

// function parseJSON(response) {
//     return response.json();
// }

// const api = { getGames, getPicks, updatePick, createPick };

// export default api;

import { normalize, schema } from 'normalizr';
import { camelizeKeys } from 'humps';

// Extracts the next page URL from Github API response.
const getNextPageUrl = response => {
  const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}

//const API_ROOT;

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema) => {
  //const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(endpoint)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        const camelizedJson = camelizeKeys(json)
        const nextPageUrl = getNextPageUrl(response)

        return Object.assign({},
          normalize(camelizedJson, schema),
          { nextPageUrl }
        )
      })
    )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

// GitHub's API may return results with uppercase letters while the query
// doesn't contain any. For example, "someuser" could result in "SomeUser"
// leading to a frozen UI as it wouldn't find "someuser" in the entities.
// That's why we're forcing lower cases down there.

const gameSchema = new schema.Entity('games', {}, {
  idAttribute: game => game._id
})

const pickSchema = new schema.Entity('picks', {}, {
  idAttribute: pick => pick._id
})

// Schemas for Github API responses.
export const Schemas = {
  GAME: gameSchema,
  GAME_ARRAY: [gameSchema],
  PICK: pickSchema,
  PICK_ARRAY: [pickSchema]
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
