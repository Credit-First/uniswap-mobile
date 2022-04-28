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
      const item = {
        name: payload.name,
        address: payload.address,
        symbol: payload.symbol,
        decimals: payload.decimals,
        chainName: payload.chainName
      }
      return state.concat(item);
    case DELETE_TOKEN:
      return deleteToken(state, payload);
    case FETCH_TOKENS:
    default:
      return state;
  }
}

function deleteToken(state, payload) {
  let ret = state.filter((cell) => cell.address !== payload.address && cell.chainName !== payload.chainName);
  return ret;
}
