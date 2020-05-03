import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';

const getAccount = (accountName, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
  return rpc.get_account(accountName);
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

export { getAccount, transfer };
