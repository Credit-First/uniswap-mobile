// @flow

import { createAction } from 'redux-actions';

/**
 * Action Types
 */

export const FETCH_ACCOUNTS = 'accounts/FETCH_ACCOUNTS';
export const CONNECT_ACCOUNT = 'accounts/CONNECT_ACCOUNT';
export const DELETE_ACCOUNT = 'accounts/DELETE_ACCOUNT';
export const CHOOSE_ACTIVE_ACCOUNT = 'accounts/CHOOSE_ACTIVE_ACCOUNT';

/**
 * Action Creators
 */
export const accountsActionCreators = {
  fetchAccounts: createAction(FETCH_ACCOUNTS),
  connectAccount: createAction(CONNECT_ACCOUNT),
  deleteAccount: createAction(DELETE_ACCOUNT),
  chooseActiveAccount: createAction(CHOOSE_ACTIVE_ACCOUNT),
};
