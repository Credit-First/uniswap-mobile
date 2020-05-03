// @flow

import { LOGOUT } from '../sharedActions';

import { defaultReducers } from '../defaultReducers';

export default function resetReducer(state, action) {
  switch (action.type) {
    case LOGOUT: {
      // Reset redux-store
      return {
        ...defaultReducers,
      };
    }
    default:
      return state;
  }
}
