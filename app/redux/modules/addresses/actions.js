// @flow

import { createAction } from 'redux-actions';

/**
 * Action Types
 */

export const FETCH_ADDRESSES = 'addresses/FETCH_ACCOUNTS';
export const ADD_ADDRESS = 'addresses/ADD_ADDRESS';
export const DELETE_ADDRESS = 'addresses/DELETE_ADDRESS';

/**
 * Action Creators
 */
export const addressesActionCreators = {
  fetchAddresses: createAction(FETCH_ADDRESSES),
  addAddress: createAction(ADD_ADDRESS),
  deleteAddress: createAction(DELETE_ADDRESS)
};
