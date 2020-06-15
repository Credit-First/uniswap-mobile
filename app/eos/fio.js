import { Fio, Ecc } from '@fioprotocol/fiojs';
import { Api } from '@fioprotocol/fiojs/dist/chain-api';
import { JsonRpc } from '@fioprotocol/fiojs/dist/tests/chain-jsonrpc';
import { JsSignatureProvider } from '@fioprotocol/fiojs/dist/chain-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getChain } from './chains';



const fioAddPublicAddress = async (fioAccount, account, fee) => {

  const fioChain = getChain(fioAccount.chainName);
  const rpc = new JsonRpc(fioChain.endpoint);
  const signatureProvider = new JsSignatureProvider([fioAccount.privateKey]);

  const info = await rpc.get_info(); 
  const blockInfo = await rpc.get_block(info.last_irreversible_block_num); 
  const currentDate = new Date(); 
  const timePlusTen = currentDate.getTime() + 10000; 
  const timeInISOString = (new Date(timePlusTen)).toISOString(); 
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });

  const transaction = { 
    expiration, 
    ref_block_num: blockInfo.block_num & 0xffff, 
    ref_block_prefix: blockInfo.ref_block_prefix, 
    actions: [{
      account: 'fio.address',
      name: 'addaddress',
      authorization: [{ 
        actor: fioAccount.address, 
        permission: 'active', 
      }],
      data: { 
        fio_address: fioAccount.address,
        public_addresses: [{
          chain_code: account.chainName,
          token_code: account.chainName,
          public_address: account.publicKey,
        }],
        max_fee: fee,
        tpid: 'crypto@tribe',
        actor: fioAccount.accountName,
      }, 
    }] 
  };
  console.log(transaction);

  return api.transact(transaction);
};

export {
  fioAddPublicAddress,
};
