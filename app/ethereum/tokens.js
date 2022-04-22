import etherTokenList from './ethereum-tokens.json';
import bscTokenList from './bsc-tokens.json';
import polygonTokenList from './polygon-tokens.json';

const STABLE_LENGTH = 4;

const getEVMTokens = chainName => {
  var chainTokens = [];
  switch (chainName) {
    case 'ETH':
      chainTokens = etherTokenList.tokens.slice(0, STABLE_LENGTH + 1)
      break;
    case 'BNB':
      chainTokens = bscTokenList.tokens.slice(0, STABLE_LENGTH)
      break;
    case 'MATIC':
      chainTokens = polygonTokenList.tokens.slice(0, STABLE_LENGTH)
      break;
    default:
      chainTokens = etherTokenList.tokens.slice(0, STABLE_LENGTH)
  }
  return chainTokens;
};

const getTokenByName = tokenName => {
  return tokens.find(item => item.symbol === tokenName);
};

const getBalance = async (accountName, token, handler) => {

};

const transferToken = (toAccountName, amount, memo, fromAccount, token) => {

};

export { getEVMTokens, getTokenByName, getBalance, transferToken };
