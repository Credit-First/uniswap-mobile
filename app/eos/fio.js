import { JsonRpc, Api } from 'eosjs-rn';
import { JsSignatureProvider } from 'eosjs-rn/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getChain } from './chains';
import { Fio, Ecc } from '@fioprotocol/fiojs';


const fioAddPublicAddress = (fioAccount, account, fee) => {
  console.log("fioAddPublicAddress called");
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

export {
  fioAddPublicAddress,
};
