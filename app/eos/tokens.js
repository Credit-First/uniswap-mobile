import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getEndpoint } from './chains';
import { log } from '../logger/logger';

var tokens = [
  {
    name: 'ECOIN',
    chain: 'TLOS',
    contract: 'ecoin1nation',
  },
  {
    name: 'SEEDS',
    chain: 'TLOS',
    contract: 'token.seeds',
  },
  {
    name: 'TEACH',
    chain: 'TLOS',
    contract: 'teachology14',
  },
  {
    name: 'QBE',
    chain: 'TLOS',
    contract: 'qubicletoken',
  },
  {
    name: 'EZAR',
    chain: 'TLOS',
    contract: 'stablecoin.z',
  },
  {
    name: 'SQRL',
    chain: 'TLOS',
    contract: 'sqrlwalletio',
  },
  {
    name: 'TLOSDAC',
    chain: 'TLOS',
    contract: 'telosdacdrop',
  },
  {
    name: 'YNT',
    chain: 'TLOS',
    contract: 'sesacashmain',
  },
  {
    name: 'DRIC',
    chain: 'TLOS',
    contract: 'persiandaric',
  },
  {
    name: 'GEM',
    chain: 'TLOS',
    contract: 'lord',
  },
  {
    name: 'SAND',
    chain: 'TLOS',
    contract: 'sandiegocoin',
  },
  {
    name: 'KANDA',
    chain: 'TLOS',
    contract: 'telokandaone',
  },
  {
    name: 'USDT',
    chain: 'EOS',
    contract: 'tethertether',
  },
  {
    name: 'WAL',
    chain: 'EOS',
    contract: 'whaleextoken',
  },
  {
    name: 'OGX',
    chain: 'EOS',
    contract: 'organixtoken',
  },
  {
    name: 'FLX',
    chain: 'EOS',
    contract: 'felixtokenio',
  },
  {
    name: 'DAPP',
    chain: 'EOS',
    contract: 'dappservices',
  },
  {
    name: 'TPT',
    chain: 'EOS',
    contract: 'eosiotptoken',
  },
  {
    name: 'DFS',
    chain: 'EOS',
    contract: 'minedfstoken',
  },
  {
    name: 'DEOS',
    chain: 'EOS',
    contract: 'eosdmddtoken',
  },
  {
    name: 'YFC',
    chain: 'EOS',
    contract: 'yfctokenmain',
  },
  {
    name: 'LOOT',
    chain: 'EOS',
    contract: 'lootglobcore',
  },
  {
    name: 'BG',
    chain: 'EOS',
    contract: 'bgbgbgbgbgbg',
  },
  {
    name: 'NDX',
    chain: 'EOS',
    contract: 'newdexissuer',
  },
  {
    name: 'KEY',
    chain: 'EOS',
    contract: 'mkstaketoken',
  },
  {
    name: 'DMD',
    chain: 'EOS',
    contract: 'eosdmdtokens',
  },
  {
    name: 'DAD',
    chain: 'EOS',
    contract: 'dadtoken1111',
  },
  {
    name: 'USN',
    chain: 'EOS',
    contract: 'danchortoken',
  },
  {
    name: 'DOP',
    chain: 'EOS',
    contract: 'dolphintoken',
  },
  {
    name: 'GMCC',
    chain: 'EOS',
    contract: 'superboxgmcc',
  },
  {
    name: 'FISH',
    chain: 'EOS',
    contract: 'fisheostoken',
  },
  {
    name: 'EMT',
    chain: 'EOS',
    contract: 'emanateoneos',
  },
  {
    name: 'ONES',
    chain: 'EOS',
    contract: 'eosonestoken',
  },
  {
    name: 'PBTC',
    chain: 'EOS',
    contract: 'btc.ptokens',
  },
  {
    name: 'TXT',
    chain: 'EOS',
    contract: 'trusteamwins',
  },
  {
    name: 'TKT',
    chain: 'EOS',
    contract: 'eossanguotkt',
  },
  {
    name: 'VIGOR',
    chain: 'EOS',
    contract: 'vigortoken11',
  },
  {
    name: 'BOID',
    chain: 'EOS',
    contract: 'boidcomtoken',
  },
  {
    name: 'KROWN',
    chain: 'EOS',
    contract: 'krowndactokn',
  },
  {
    name: 'CHEX',
    chain: 'EOS',
    contract: 'chexchexchex',
  },
  {
    name: 'VIG',
    chain: 'EOS',
    contract: 'vig111111111',
  },
  {
    name: 'IQ',
    chain: 'EOS',
    contract: 'everipediaiq',
  },
  {
    name: 'SENSE',
    chain: 'EOS',
    contract: 'sensegenesis',
  },
  {
    name: 'LIBRA',
    chain: 'EOS',
    contract: 'usdcoinchain',
  },
  {
    name: 'PIZZA',
    chain: 'EOS',
    contract: 'pizzatotoken',
  },
  {
    name: 'HVT',
    chain: 'EOS',
    contract: 'hirevibeshvt',
  },
  {
    name: 'PLO',
    chain: 'EOS',
    contract: 'ploutoztoken',
  },
  {
    name: 'AMZ',
    chain: 'EOS',
    contract: 'amzcoinvault',
  },
  {
    name: 'EOSISH',
    chain: 'EOS',
    contract: 'buildertoken',
  },
  {
    name: 'EETH',
    chain: 'EOS',
    contract: 'ethsidechain',
  },
  {
    name: 'BOX',
    chain: 'EOS',
    contract: 'token.defi',
  },
  {
    name: 'ADE',
    chain: 'EOS',
    contract: 'buildertoken',
  },
  {
    name: 'DICE',
    chain: 'EOS',
    contract: 'betdicetoken',
  },
  {
    name: 'PLO',
    chain: 'EOS',
    contract: 'playeronetkn',
  },
  {
    name: 'PUB',
    chain: 'EOS',
    contract: 'publytoken11',
  },
  {
    name: 'TLOSD',
    chain: 'TLOS',
    contract: 'tokens.swaps',
  },
  {
    name: 'PBTC',
    chain: 'TLOS',
    contract: 'btc.ptokens',
  },
];

const getTokens = chainName => {
  var name =
    chainName && chainName.indexOf(' ') >= 0 ? chainName.trim() : chainName;
  name = name === 'Telos' ? 'TLOS' : name;
  var chainTokens = [];
  for (let token of tokens) {
    if (token.chain === name) {
      chainTokens.push(token);
    }
  }
  return chainTokens;
};

const getTokenByName = tokenName => {
  return tokens.find(item => item.name === tokenName);
};

const getBalance = async (accountName, token, handler) => {
  const endpoint = getEndpoint(token.chain);
  var request = {
    account: accountName,
    code: token.contract,
    symbol: token.name,
  };
  try {
    fetch(endpoint + '/v1/chain/get_currency_balance', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then(response => response.json())
      .then(json => handler(json))
      .catch(error =>
        log({
          description:
            'getBalance - fetch ' +
            endpoint +
            '/v1/chain/get_currency_balance [' +
            accountName +
            ', ' +
            token.name +
            ', ' +
            token.contract +
            ']',
          cause: error,
          location: 'tokens.js',
        }),
      );
  } catch (err) {
    log({
      description:
        'getBalance - fetch ' +
        endpoint +
        '/v1/chain/get_currency_balance [' +
        accountName +
        ', ' +
        token.name +
        ', ' +
        token.contract +
        ']',
      cause: error,
      location: 'tokens.js',
    });
  }
};

const transferToken = (toAccountName, amount, memo, fromAccount, token) => {
  const endpoint = getEndpoint(token.chain);
  const rpc = new JsonRpc(endpoint);
  const signatureProvider = new JsSignatureProvider([fromAccount.privateKey]);

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  return api.transact(
    {
      actions: [
        {
          account: token.contract,
          name: 'transfer',
          authorization: [
            {
              actor: fromAccount.accountName,
              permission: 'active',
            },
          ],
          data: {
            from: fromAccount.accountName,
            to: toAccountName,
            quantity: `${amount.toFixed(4)} ${token.name}`,
            memo,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 100,
    },
  );
};

export { getTokens, getTokenByName, getBalance, transferToken };
