// @flow

import {
  CONNECT_ACCOUNT,
  DELETE_ACCOUNT,
  FETCH_ACCOUNTS,
  FETCH_ADDRESSES,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  FETCH_KEYS,
  ADD_KEY,
  SET_CONFIG,
  GET_CONFIG,
} from './actions';
import { defaultReducers } from '../defaultReducers';

const DEFAULT = defaultReducers.accountsState;

export default function accountsState(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case CONNECT_ACCOUNT:
      return {
        accounts: state.accounts.concat([payload]),
        addresses: state.addresses,
        keys: state.keys,
        config: state.config,
      };
    case DELETE_ACCOUNT:
      return deleteAccount(state, payload);
    case FETCH_ACCOUNTS:
      break;
    case ADD_ADDRESS:
      return {
        accounts: state.accounts,
        addresses: state.addresses.concat([payload]),
        keys: state.keys,
        config: state.config,
      };
    case DELETE_ADDRESS:
      return deleteAddress(state, payload);
    case FETCH_ADDRESSES:
      break;
    case ADD_KEY:
      return {
        accounts: state.accounts,
        addresses: state.addresses,
        keys: state.keys.concat([payload]),
        config: state.config,
      };
    case FETCH_KEYS:
      break;
    case SET_CONFIG:
      return {
        accounts: state.accounts,
        addresses: state.addresses,
        keys: state.keys,
        config: payload,
      };
    case GET_CONFIG:
      break;
    default:
      return state;
  }
}

function deleteAccount(state, payload) {
  let accounts = state.accounts.filter((_account, index) => index !== payload);
  let addresses = state.addresses;
  let keys = state.keys;
  let config = state.config;
  return {
    accounts,
    addresses,
    keys,
    config,
  };
}

function deleteAddress(state, payload) {
  let accounts = state.accounts;
  let addresses = state.addresses.filter(
    (_address, index) => index !== payload,
  );
  let keys = state.keys;
  let config = state.config;
  return {
    accounts,
    addresses,
    keys,
    config,
  };
}
