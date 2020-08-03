import algosdk from 'algosdk';
import { log } from '../logger/logger';
import { Alert } from 'react-native';

const algo_endpoint = 'https://algo.eostribe.io';
const client_token = '3081024bfba2474b8c5140f8320ddcb1c43fb0c01add547c74694587b2ee799b';
const Buffer = require("buffer").Buffer;


  const makeTransactionWithParams = async (sender, receiver, amount, memo, params, callback) => {
    let algoAmount = amount * 1000000;
    let base64Memo = new Buffer(memo).toString("base64");
    let transaction = algosdk.makePaymentTxn(
          sender.account.addr, /* sender */
          receiver, /* receiver */
          params.minFee, /* fee */
          algoAmount, /* amount */
          undefined, /*closeRemainderTo*/
          params.lastRound, /* firstRound */
          params.lastRound + 1000, /* lastRound */
          new Uint8Array(Buffer.from(base64Memo, "base64")), /* memo */
          params.genesishashb64,
          params.genesisID);
    let txns = [transaction];
    let txgroup = algosdk.assignGroupID(txns);
    let myAccount = algosdk.mnemonicToSecretKey(sender.mnemonic);
    let signedTx = transaction.signTxn( myAccount.sk );
    // Combine the signed transactions
    let signed = [];
    signed.push( signedTx );
    let algodClient = new algosdk.Algod(client_token, algo_endpoint, '');
    let tx = (await algodClient.sendRawTransactions(signed));
    if(callback && tx.txId) {
      callback(tx.txId);
    } else if(!tx.txId) {
      log({
        description: 'makeTransactionWithParams error',
        cause: tx,
        location: 'algo'
      });
      Alert.alert('Failed to prepare Algorand transaction');
    }
  };

  const submitAlgoTransaction = async (sender, receiver, amount, memo, callback) => {
    if (!receiver) {
      log({
        description: 'submitAlgoTransaction error',
        cause: 'Empty Algo receiver passed',
        location: 'algo'
      });
      Alert.alert('No receiver set for Algo transfer!');
      return;
    }
    fetch(algo_endpoint+'/v1/transactions/params')
        .then((response) => response.json())
        .then((json) => {
          makeTransactionWithParams(sender, receiver, amount, memo, json, callback);
        })
        .catch((error) => {
          log({
            description: 'submitAlgoTransaction error',
            cause: error,
            location: 'algo'
          });
          Alert.alert('Failed to submit Algorand transfer');
        });
  };

  export {
    submitAlgoTransaction,
  };
