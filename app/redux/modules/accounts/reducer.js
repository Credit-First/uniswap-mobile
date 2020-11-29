// @flow

import {
  CONNECT_ACCOUNT,
  DELETE_ACCOUNT,
  FETCH_ACCOUNTS,
  CHOOSE_ACTIVE_ACCOUNT,
  FETCH_ADDRESSES,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  FETCH_KEYS,
  ADD_KEY,
} from './actions';
import { defaultReducers } from '../defaultReducers';

const DEFAULT = defaultReducers.accountsState;

export default function accountsState(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case CONNECT_ACCOUNT:
      return {
        accounts: state.accounts.concat([payload]),
        activeAccountIndex: state.accounts.length,
        addresses: state.addresses,
        keys: state.keys,
      };
    case DELETE_ACCOUNT:
      return deleteAccount(state, payload);
    case FETCH_ACCOUNTS:
      break;
    case CHOOSE_ACTIVE_ACCOUNT:
      return {
        ...state,
        activeAccountIndex: payload,
      };
    case ADD_ADDRESS:
      return {
        accounts: state.accounts,
        activeAccountIndex: state.accounts.length,
        addresses: state.addresses.concat([payload]),
        keys: state.keys,
      };
    case DELETE_ADDRESS:
      return deleteAddress(state, payload);
    case FETCH_ADDRESSES:
      break;
    case ADD_KEY:
      return {
        accounts: state.accounts,
        activeAccountIndex: state.accounts.length,
        addresses: state.addresses,
        keys: state.keys.concat([payload]),
      };
    case FETCH_KEYS:
      break;
    default:
      return state;
  }
}

function deleteAccount(state, payload) {
  let accounts = state.accounts.filter((_account, index) => index !== payload);

  let activeAccountIndex;
  if (accounts.length === 0) {
    activeAccountIndex = -1;
  }

  if (accounts.length === state.activeAccountIndex) {
    activeAccountIndex = accounts.length - 1;
  }
  let addresses = state.addresses;
  let keys = state.keys;
  return {
    accounts,
    activeAccountIndex,
    addresses,
    keys
  };
}

function deleteAddress(state, payload) {
  let accounts = state.accounts;
  let activeAccountIndex = state.activeAccountIndex;
  let addresses = state.addresses.filter((_address, index) => index !== payload);
  let keys = state.keys;
  return {
    accounts,
    activeAccountIndex,
    addresses,
    keys
  };
}
