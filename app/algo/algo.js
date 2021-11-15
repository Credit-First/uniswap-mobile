import algosdk from 'algosdk';
import { log } from '../logger/logger';
import { Alert } from 'react-native';

const algo_endpoint = 'https://algo.eostribe.io';
const client_token = '3081024bfba2474b8c5140f8320ddcb1c43fb0c01add547c74694587b2ee799b';
const Buffer = require('buffer').Buffer;

const algoDivider = 1000000;

const makeTransactionWithParams = async (
  sender,
  receiver,
  amount,
  memo,
  params,
  callback,
) => {
  let algoAmount = amount * algoDivider;
  let base64Memo = new Buffer(memo).toString('base64');
  params.genesisHash = params.genesishashb64;
  params.firstRound = params.lastRound;
  params.lastRound = params.lastRound + 1000;
  let transaction = algosdk.makePaymentTxnWithSuggestedParams(
    sender.account.addr /* sender */,
    receiver /* receiver */,
    algoAmount /* amount */,
    undefined /*closeRemainderTo*/,
    new Uint8Array(Buffer.from(base64Memo, 'base64')) /* memo */,
    params,
  );
  let txns = [transaction];
  let txgroup = algosdk.assignGroupID(txns);
  let myAccount = algosdk.mnemonicToSecretKey(sender.mnemonic);
  let signedTx = transaction.signTxn(myAccount.sk);
  // Combine the signed transactions
  let signed = [];
  signed.push(signedTx);
  console.log(signedTx);
  let algodClient = new algosdk.Algodv2(client_token, algo_endpoint, '');
  let tx = await algodClient.sendRawTransactions(signed);
  console.log(tx);
  if (callback && tx.txId) {
    callback(tx.txId);
  } else if (!tx.txId) {
    log({
      description: 'makeTransactionWithParams error',
      cause: tx,
      location: 'algo',
    });
    Alert.alert('Failed to prepare Algorand transaction');
  }
};

const processAlgoTransaction = async (
  sender,
  receiver,
  amount,
  memo,
  balance,
  callback,
) => {
  if (amount > balance) {
    Alert.alert('Insufficient balance ' + balance + ' ALGO for transfer');
    return;
  }
  fetch(algo_endpoint + '/v1/transactions/params')
    .then(response => response.json())
    .then(json => {
      console.log(json);
      makeTransactionWithParams(sender, receiver, amount, memo, json, callback);
    })
    .catch(error => {
      log({
        description: 'processAlgoTransaction error',
        cause: error,
        location: 'algo',
      });
      Alert.alert('Failed to submit Algorand transfer');
    });
};

const submitAlgoTransaction = async (
  sender,
  receiver,
  amount,
  memo,
  callback,
) => {
  if (!receiver) {
    log({
      description: 'submitAlgoTransaction error',
      cause: 'Empty Algo receiver passed',
      location: 'algo',
    });
    Alert.alert('No receiver set for Algo transfer!');
    return;
  }
  try {
    const addr = sender.account.addr;
    fetch('http://algo.eostribe.io/v1/account/' + addr, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json =>
        processAlgoTransaction(
          sender,
          receiver,
          amount,
          memo,
          parseFloat(json.amount) / algoDivider,
          callback,
        ),
      )
      .catch(error =>
        log({
          description:
            'submitAlgoTransaction - fetch https://algo.eostribe.io/v1/account/' +
            addr,
          cause: error,
          location: 'algo',
        }),
      );
  } catch (err) {
    log({ description: 'submitAlgoTransaction', cause: err, location: 'algo' });
    return;
  }
};

export { submitAlgoTransaction };
