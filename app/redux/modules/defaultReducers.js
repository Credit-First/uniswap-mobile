// @flow



const accountsState = {
  accounts: [],
  addresses: [],
  keys: [],
  totals: [],
  history: [],
  config: {
    showAllTokens: true,
  },
};

const tokensState = [];

export const defaultReducers = {
  accountsState,
  tokensState,
};
