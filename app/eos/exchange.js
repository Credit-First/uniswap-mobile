import { getChain } from './chains';
import { get } from 'lodash';

const getNewdexSymbol = (fromChain, toChain) => {
  if (fromChain.name === 'EOS') {
    return `eosio.token-${toChain.symbol.toLowerCase()}-eos`;
  } else if (toChain.name === 'EOS') {
    return `eosio.token-${fromChain.symbol.toLowerCase()}-eos`;
  } else {
    return null;
  }
};

const getNewdexPrice = async (fromAccount, toAccount) => {
  const fromChain = getChain(fromAccount.chainName);
  const toChain = getChain(toAccount.chainName);
  if (!fromChain || !toChain) {
    return;
  }

  const symbol = getNewdexSymbol(fromChain, toChain);
  if (!symbol) {
    return null;
  }

  try {
    const res = await fetch(`https://api.newdex.io/v1/price?symbol=${symbol}`);
    const resJson = await res.json();
    const price = get(resJson, 'data.price');

    if (!price) {
      return null;
    }

    if (fromChain.name === 'EOS') {
      return 1.0 / price;
    } else {
      return price;
    }
  } catch (e) {
    console.log('get newdex price failed with error', e);
    return null;
  }
};

export { getNewdexSymbol, getNewdexPrice };
