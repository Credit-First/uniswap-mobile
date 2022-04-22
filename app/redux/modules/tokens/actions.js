// @flow

import { createAction } from 'redux-actions';

/**
 * Action Types
 */

export const FETCH_TOKENS = 'tokens/FETCH_TOKENS';
export const ADD_TOKEN = 'tokens/ADD_TOKEN';
export const DELETE_TOKEN = 'tokens/DELETE_TOKEN';

/**
 * Action Creators
 */
export const tokensActionCreators = {
  fetchTokens: createAction(FETCH_TOKENS),
  addToken: createAction(ADD_TOKEN),
  deleteToken: createAction(DELETE_TOKEN),
};
