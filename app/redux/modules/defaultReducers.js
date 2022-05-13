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
  tokens: [],
  nftTokens: [],
  nftShowStatus: false,
};

export const defaultReducers = {
  accountsState,
};
