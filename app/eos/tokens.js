import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getEndpoint } from './chains';

const tokens = [
  {
    name: 'ECOIN',
    chain: 'TLOS',
    contract: 'ecoin1nation',
  },
];

const getTokens = chainName => {
  chainName = (chainName.indexOf(' ') >= 0) ? chainName.trim() : chainName;
  return tokens.find(item => (item.chain === chainName));
};

const getBalance = async (accountName, token, handler) => {
  const endpoint = getEndpoint(token.chain);
  var request = {
    "account": accountName,
    "code": token.contract,
    "symbol": token.name
  };
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
    .catch(error => log({
      description: 'getBalance - fetch '+endpoint + '/v1/chain/get_currency_balance ['+accountName+', '+token+']',
      cause: error,
      location: 'tokens.js'
    })
  );
};

const transfer = (toAccountName, amount, memo, fromAccount, token) => {
  const endpoint = getEndpoint(token.chain);
  const rpc = new JsonRpc(endpoint);
  const signatureProvider = new JsSignatureProvider([fromAccount.privateKey]);

  console.log(amount);
  console.log(amount.toFixed(4));

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
      expireSeconds: 30,
    },
  );
};

export { getTokens, getBalance, transfer };
