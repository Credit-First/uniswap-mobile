// @flow

import { createAction } from 'redux-actions';

/**
 * Action Types
 */

export const FETCH_ACCOUNTS = 'accounts/FETCH_ACCOUNTS';
export const CONNECT_ACCOUNT = 'accounts/CONNECT_ACCOUNT';
export const DELETE_ACCOUNT = 'accounts/DELETE_ACCOUNT';
export const CHOOSE_ACTIVE_ACCOUNT = 'accounts/CHOOSE_ACTIVE_ACCOUNT';

export const FETCH_ADDRESSES = 'accounts/FETCH_ADDRESSES';
export const ADD_ADDRESS = 'accounts/ADD_ADDRESS';
export const DELETE_ADDRESS = 'accounts/DELETE_ADDRESS';

export const FETCH_KEYS = 'accounts/FETCH_KEYS';
export const ADD_KEY = 'accounts/ADD_KEY';

export const SET_CONFIG = 'accounts/SET_CONFIG';
export const GET_CONFIG = 'accounts/GET_CONFIG';

/**
 * Action Creators
 */
export const accountsActionCreators = {
  fetchAccounts: createAction(FETCH_ACCOUNTS),
  connectAccount: createAction(CONNECT_ACCOUNT),
  deleteAccount: createAction(DELETE_ACCOUNT),
  chooseActiveAccount: createAction(CHOOSE_ACTIVE_ACCOUNT),
  fetchAddresses: createAction(FETCH_ADDRESSES),
  addAddress: createAction(ADD_ADDRESS),
  deleteAddress: createAction(DELETE_ADDRESS),
  fetchKeys: createAction(FETCH_KEYS),
  addKey: createAction(ADD_KEY),
  setConfig: createAction(SET_CONFIG),
  getConfig: createAction(GET_CONFIG),
};
