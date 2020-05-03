import { JsonRpc } from 'eosjs-rn';

const getAccount = (accountName, chain) => {
  const rpc = new JsonRpc(chain.endpoint);
  return rpc.get_account(accountName);
};

export { getAccount };
