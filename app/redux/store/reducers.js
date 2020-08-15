// @flow

import { persistCombineReducers } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

import { LOGOUT } from '../modules/sharedActions';
import { accountsState, addressesState, resetReducer } from '../modules';

const storage = createSensitiveStorage({
  keychainService: 'kwalletKeyChain',
  sharedPreferencesName: 'kwalletKeyChainharedPrefs',
});

const config = {
  version: 0,
  key: '@eostribe_krypto_wallet_redux_store',
  storage: storage,
};

const appReducer = persistCombineReducers(config, {
  accountsState,
  addressesState,
});

export default function rootReducer(state, action) {
  let finalState = appReducer(state, action);

  if (action.type === LOGOUT) {
    finalState = resetReducer(finalState, action);
  }

  return finalState;
}
