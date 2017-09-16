/* eslint-disable no-undef */
import URLSearchParams from 'url-search-params';
import queryString from 'query-string';

import { getAccessToken, serverLogout } from './AuthService';

import { normalize, schema } from 'normalizr';
import { camelizeKeys } from 'humps';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, method, body, schema) => {
  //const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(endpoint, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        method: method ? method : 'GET',
        body: body ? body : {}
    })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        return Promise.resolve(json);
        // const camelizedJson = camelizeKeys(json)
        // const nextPageUrl = getNextPageUrl(response)

        // return Object.assign({},
        //   normalize(camelizedJson, schema),
        //   { nextPageUrl }
        // )
      })
    );
};

const gameSchema = new schema.Entity('games', {}, {
  idAttribute: game => game._id
});

const pickSchema = new schema.Entity('picks', {}, {
  idAttribute: pick => pick._id
});

// Schemas for Github API responses.
export const Schemas = {
  GAME: gameSchema,
  GAME_ARRAY: [gameSchema],
  PICK: pickSchema,
  PICK_ARRAY: [pickSchema]
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { method, body, schema, types } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, method, body, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};