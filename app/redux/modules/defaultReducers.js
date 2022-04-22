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

const tokensState = {
  names: [],
  addresses: [],
  symbols: [],
  decimals: [],
  chainNames: [],
};

export const defaultReducers = {
  accountsState,
  tokensState,
};
