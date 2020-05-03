// @flow

import {
  CONNECT_ACCOUNT,
  DELETE_ACCOUNT,
  FETCH_ACCOUNTS,
  CHOOSE_ACTIVE_ACCOUNT,
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

  return {
    accounts,
    activeAccountIndex,
  };
}
