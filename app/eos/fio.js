import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { Api } from '@fioprotocol/fiojs/dist/chain-api';
import { JsonRpc } from '@fioprotocol/fiojs/dist/tests/chain-jsonrpc';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getChain } from './chains';

const rejectFundsRequest = async (payerFioAccount,
  fioRequestId,
  fee) => {

  const payerActor = payerFioAccount.accountName;
  const payerPrivateKey = payerFioAccount.privateKey;

  const fioChain = getChain('FIO');
  const rpc = new JsonRpc(fioChain.endpoint);

  const info = await rpc.get_info();
  const blockInfo = await rpc.get_block(info.last_irreversible_block_num);
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = (new Date(timePlusTen)).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: 'fio.reqobt',
      name: 'rejectfndreq',
      authorization: [{
        actor: payerActor,
        permission: 'active',
      }],
      data: {
        fio_request_id: fioRequestId,
        max_fee: fee,
        tpid: 'crypto@tribe',
        actor: payerActor,
      },
    }]
  };

  var abiMap = new Map();
  var tokenRawAbi = await rpc.get_raw_abi('fio.reqobt');
  abiMap.set('fio.reqobt', tokenRawAbi);

  const chainId = info.chain_id;
  var privateKeys = [payerPrivateKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  var pushResult = await fetch(fioChain.endpoint + '/v1/chain/push_transaction', { body: JSON.stringify(tx), method: 'POST', });

  const json = await pushResult.json();
  if (json.processed && json.processed.except) {
   throw new RpcError(json);
 }
  return json;
};

const recordObtData = async (payerFioAccount,
  payeeFioAddress,
  payeePublicKey,
  token,
  amount,
  fioRequestId,
  transactionId,
  memo,
  fee) => {

    const payerFioAddress = payerFioAccount.address;
    const payerActor = payerFioAccount.accountName;
    const payerPrivateKey = payerFioAccount.privateKey;
    const payerPublicKey = Ecc.privateToPublic(payerPrivateKey);

    const fioChain = getChain('FIO');
    const rpc = new JsonRpc(fioChain.endpoint);

    const info = await rpc.get_info();
    const blockInfo = await rpc.get_block(info.last_irreversible_block_num);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = (new Date(timePlusTen)).toISOString();
    const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

    const obtContent = {
      payer_public_address: payerPublicKey,
      payee_public_address: payeePublicKey,
      amount: amount.toString(),
      chain_code: token,
      token_code: token,
      status: 'sent_to_blockchain',
      obt_id: transactionId,
      memo: memo,
      hash: null,
      offline_url: null
    };
    //console.log(obtContent);

    const cipher = Fio.createSharedCipher({
      privateKey: payerPrivateKey,
      publicKey: payeePublicKey,
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder()}
    );
    const cipherHex = cipher.encrypt('record_obt_data_content', obtContent);

    const transaction = {
      expiration,
      ref_block_num: blockInfo.block_num & 0xffff,
      ref_block_prefix: blockInfo.ref_block_prefix,
      actions: [{
        account: 'fio.reqobt',
        name: 'recordobt',
        authorization: [{
          actor: payerActor,
          permission: 'active',
        }],
        data: {
          payer_fio_address: payerFioAddress,
          payee_fio_address: payeeFioAddress,
          content: cipherHex,
          fio_request_id: fioRequestId,
          max_fee: fee,
          tpid: 'crypto@tribe',
          actor: payerActor,
        },
      }]
    };

    var abiMap = new Map();
    var tokenRawAbi = await rpc.get_raw_abi('fio.reqobt');
    abiMap.set('fio.reqobt', tokenRawAbi);

    const chainId = info.chain_id;
    var privateKeys = [payerPrivateKey];

    const tx = await Fio.prepareTransaction({
      transaction,
      chainId,
      privateKeys,
      abiMap,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });

    var pushResult = await fetch(fioChain.endpoint + '/v1/chain/push_transaction', { body: JSON.stringify(tx), method: 'POST', });

    const json = await pushResult.json();
    if (json.processed && json.processed.except) {
     throw new RpcError(json);
   }
    return json;
};


const fioNewFundsRequest = async (fromFioAccount,
  toFioAddress,
  toPublicKey,
  token,
  amount,
  memo,
  fee) => {

  const fromFioAddress = fromFioAccount.address;
  const fromActor = fromFioAccount.accountName;

  const fioChain = getChain('FIO');
  const rpc = new JsonRpc(fioChain.endpoint);

  const info = await rpc.get_info();
  const blockInfo = await rpc.get_block(info.last_irreversible_block_num);
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = (new Date(timePlusTen)).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const newFundsContent = {
    payee_public_address: fromFioAddress,
    amount: amount.toString(),
    chain_code: token,
    token_code: token,
    memo: memo,
    hash: null,
    offline_url: null
  };

  const fromPrivateKey = fromFioAccount.privateKey;
  const cipher = Fio.createSharedCipher({
    privateKey: fromPrivateKey,
    publicKey: toPublicKey,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()}
  );
  const cipherHex = cipher.encrypt('new_funds_content', newFundsContent);

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: 'fio.reqobt',
      name: 'newfundsreq',
      authorization: [{
        actor: fromActor,
        permission: 'active',
      }],
      data: {
        payer_fio_address: toFioAddress,
        payee_fio_address: fromFioAddress,
        content: cipherHex,
        max_fee: fee,
        tpid: 'crypto@tribe',
        actor: fromActor,
      },
    }]
  };

  var abiMap = new Map();
  var tokenRawAbi = await rpc.get_raw_abi('fio.reqobt');
  abiMap.set('fio.reqobt', tokenRawAbi);

  const chainId = info.chain_id;
  var privateKeys = [fromPrivateKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  var pushResult = await fetch(fioChain.endpoint + '/v1/chain/push_transaction', { body: JSON.stringify(tx), method: 'POST', });

  const json = await pushResult.json();
  if (json.processed && json.processed.except) {
   throw new RpcError(json);
 }
  return json;
};

// Used to add EOSIO accounts to FIO Address
const fioAddPublicAddress = async (fioAccount, account, fee) => {

  const fioChain = getChain(fioAccount.chainName);
  const rpc = new JsonRpc(fioChain.endpoint);

  const info = await rpc.get_info();
  const blockInfo = await rpc.get_block(info.last_irreversible_block_num);
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = (new Date(timePlusTen)).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  var chainName = account.chainName;
  if(chainName == "Telos") {
    chainName = "TLOS";
  }
  const accPubkey = ecc.privateToPublic(account.privateKey);
  const accName = account.accountName;
  const accIdentifier = accName + ',' + accPubkey;

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: 'fio.address',
      name: 'addaddress',
      authorization: [{
        actor: fioAccount.accountName,
        permission: 'active',
      }],
      data: {
        fio_address: fioAccount.address,
        public_addresses: [{
          chain_code: chainName,
          token_code: chainName,
          public_address: accIdentifier,
        }],
        max_fee: fee,
        tpid: 'crypto@tribe',
        actor: fioAccount.accountName,
      },
    }]
  };

  var abiMap = new Map();
  var tokenRawAbi = await rpc.get_raw_abi('fio.address');
  abiMap.set('fio.address', tokenRawAbi);

  const chainId = info.chain_id;
  var privateKeys = [fioAccount.privateKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  var pushResult = await fetch(fioChain.endpoint + '/v1/chain/push_transaction', { body: JSON.stringify(tx), method: 'POST', });

  const json = await pushResult.json();
  if (json.processed && json.processed.except) {
   throw new RpcError(json);
 }
  return json;
};

// Used to add external accounts (BTC, ETH, etc) pubkey to FIO address
const fioAddExternalAddress = async (fioAccount, actor, chainName, pubkey, fee) => {

  const fioChain = getChain(fioAccount.chainName);
  const rpc = new JsonRpc(fioChain.endpoint);

  const info = await rpc.get_info();
  const blockInfo = await rpc.get_block(info.last_irreversible_block_num);
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = (new Date(timePlusTen)).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: 'fio.address',
      name: 'addaddress',
      authorization: [{
        actor: actor,
        permission: 'active',
      }],
      data: {
        fio_address: fioAccount.address,
        public_addresses: [{
          chain_code: chainName,
          token_code: chainName,
          public_address: pubkey,
        }],
        max_fee: fee,
        tpid: 'crypto@tribe',
        actor: actor,
      },
    }]
  };

  var abiMap = new Map();
  var tokenRawAbi = await rpc.get_raw_abi('fio.address');
  abiMap.set('fio.address', tokenRawAbi);

  const chainId = info.chain_id;
  var privateKeys = [fioAccount.privateKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  var pushResult = await fetch(fioChain.endpoint + '/v1/chain/push_transaction', { body: JSON.stringify(tx), method: 'POST', });

  const json = await pushResult.json();
  if (json.processed && json.processed.except) {
   throw new RpcError(json);
 }
  return json;
};

export {
  fioAddPublicAddress,
  fioAddExternalAddress,
  fioNewFundsRequest,
  recordObtData,
  rejectFundsRequest
};
