import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getChain } from './chains';
import { getNewdexSymbol } from './exchange';

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

const newdexTransfer = (amount, fromAccount, toAccount) => {
  const fromChain = getChain(fromAccount.chainName);
  const toChain = getChain(toAccount.chainName);

  const rpc = new JsonRpc(fromChain.endpoint);
  const signatureProvider = new JsSignatureProvider([fromAccount.privateKey]);

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  const newdexAmount = amount * 0.99;
  const feeAmount = amount * 0.01;
  const symbol = getNewdexSymbol(fromChain, toChain);
  const orderType = fromChain.name === 'EOS' ? 'buy-market' : 'sell-market';
  const newdexMemo = JSON.stringify({
    type: orderType,
    symbol,
    price: '0.000000',
    channel: 'web',
    receiver: toAccount.accountName,
  });
  const feeMemo = JSON.stringify({
    type: orderType,
    symbol,
    amount: newdexAmount.toFixed(4),
    fee: feeAmount.toFixed(4),
    channel: 'web',
    sender: fromAccount.accountName,
    receiver: toAccount.accountName,
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
            to: fromChain.newdexAccount,
            quantity: `${newdexAmount.toFixed(4)} ${fromChain.symbol}`,
            memo: newdexMemo,
          },
        },
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
            to: 'eostribeprod',
            quantity: `${feeAmount.toFixed(4)} ${fromChain.symbol}`,
            memo: feeMemo,
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

const fioAddPublicAddress = (fioAccount, account, fee) => {
  const fioChain = getChain(fioAccount.chainName);
  const rpc = new JsonRpc(fioChain.endpoint);
  const signatureProvider = new JsSignatureProvider([fioAccount.privateKey]);

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  return api.transact({
    fio_address: fioAccount.address,
    public_addresses: [
      {
        chain_code: account.chainName,
        token_code: account.chainName,
        public_address: account.publicKey,
      },
    ],
    max_fee: fee,
    tpid: 'crypto@tribe',
    actor: fioAccount.accountName,
  });
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
  newdexTransfer,
  voteProducers,
  sumAmount,
  fioAddPublicAddress,
};
