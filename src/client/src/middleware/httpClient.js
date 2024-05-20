import { getAccessToken } from './authenticationClient';
import { schema } from 'normalizr';
import axios from 'axios';

const callApi = ({endpoint, method, body}) => {  
  return axios({
        url: endpoint,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        method: !method ? 'get' : method,
        data: body
    })
    .then(function(response) {
      return response.data;
    });
};

const gameSchema = new schema.Entity('games', {}, {
  idAttribute: game => game._id
});

const articleSchema = new schema.Entity('articles', {}, {
  idAttribute: article => article._id
});

export const Schemas = {
  GAME_ARRAY: [gameSchema],
  ARTICLE_ARRAY: [articleSchema]
};

export const CALL_API = 'Call API';

const NEXT_ACTION = store => next => action => {
  const callAPIAction = action[CALL_API];
  if (typeof callAPIAction === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPIAction;
  const { method, body, schema, types } = callAPIAction;

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

  return callApi({endpoint, method, body}).then(
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

export default NEXT_ACTION;