import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';

const getAccount = (accountName, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
  return rpc.get_account(accountName);
};

const getActions = (accountName, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
  return rpc.history_get_actions(accountName);
};

const getProducers = chain => {
  const rpc = new JsonRpc(chain.endpoint);
  return rpc.get_producers(true, '', 100);
};

const transfer = (toAccountName, amount, memo, fromAccount, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
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
          account: 'eosio.token',
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
            quantity: `${amount.toFixed(4)} ${chain.symbol}`,
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

const voteProducers = (producers, fromAccount, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
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
          account: 'eosio',
          name: 'voteproducer',
          authorization: [
            {
              actor: fromAccount.accountName,
              permission: 'active',
            },
          ],
          data: {
            voter: fromAccount.accountName,
            proxy: '',
            producers,
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

const sumAmount = (amount1, amount2) => {
  const m1 = parseFloat(amount1.split(' ')[0]);
  const m2 = parseFloat(amount2.split(' ')[0]);
  const totalM = m1 + m2;
  return totalM.toFixed(4);
};

export {
  getAccount,
  getProducers,
  getActions,
  transfer,
  voteProducers,
  sumAmount,
};
