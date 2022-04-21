// @flow

import {
  FETCH_TOKENS,
  ADD_TOKEN,
  DELETE_TOKEN
} from './actions';
import { defaultReducers } from '../defaultReducers';

const DEFAULT = defaultReducers.tokensState;

export default function tokensState(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ADD_TOKEN:
      return {
        names: state.names.concat([payload.name]),
        addresses: state.addresses.concat([payload.address]),
        symbols: state.symbols.concat([payload.symbol]),
        decimals: state.decimals.concat([payload.decimal]),
        chainNames: state.chainNames.concat([payload.chainName]),
      };
    case DELETE_TOKEN:
      return deleteToken(state, payload);
    case FETCH_TOKENS:
    default:
      return state;
  }
}

function deleteToken(state, payload) {
  let names = state.names.filter((_name, index) => index !== payload);
  let addresses = state.addresses.filter((_address, index) => index !== payload);
  let symbols = state.symbols.filter((_symbol, index) => index !== payload);
  let decimals = state.decimals.filter((_decimal, index) => index !== payload);
  let chainNames = state.chainNames.filter((_chainNames, index) => index !== payload);

  return {
    names,
    addresses,
    symbols,
    decimals,
    chainNames,
  };
}
