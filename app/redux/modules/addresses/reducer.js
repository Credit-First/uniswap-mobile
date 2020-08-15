// @flow

import {
  FETCH_ADDRESSES,
  ADD_ADDRESS,
  DELETE_ADDRESS
} from './actions';
import { defaultReducers } from '../defaultReducers';

const DEFAULT = defaultReducers.addressesState;

export default function addressesState(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ADD_ADDRESS:
      return {
        addresses: state.addresses.concat([payload])
      };
    case DELETE_ADDRESS:
      return deleteAddress(state, payload);
    case FETCH_ADDRESSES:
      break;
    default:
      return state;
  }
}

function deleteAddress(state, payload) {
  let addresses = state.addresses.filter((_address, index) => index !== payload);
  return {
    addresses
  };
}
