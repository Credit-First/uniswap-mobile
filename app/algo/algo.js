import algosdk from 'algosdk';
import { log } from '../logger/logger';
import { Alert } from 'react-native';

const algodNodeHost = "https://node.algoexplorerapi.io";
const algoIndexerHost = "https://algoindexer.algoexplorerapi.io";

const algodV2 = new algosdk.Algodv2("", algodNodeHost, "");
const indexer = new algosdk.Indexer("", algoIndexerHost, "");

const Buffer = require('buffer').Buffer;
const encoder = new TextEncoder();

const algoDivider = 1000000;

const getAlgoAccountInfo = async (addr) => {
  let res = await indexer.lookupAccountByID(addr).do();
  return res.account;
}

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
    // Construct the transaction
    let params = await algodV2.getTransactionParams().do();
    const note = encoder.encode(memo);
    let floatAmount = parseFloat(amount) * algoDivider;
    let txn = algosdk.makePaymentTxnWithSuggestedParams(
      sender.account.addr,
      receiver,
      floatAmount,
      undefined,
      note,
      params);
    let senderAccount = algosdk.mnemonicToSecretKey(sender.mnemonic);
    let signedTxn = txn.signTxn(senderAccount.sk);
    let txId = txn.txID().toString();
    await algodV2.sendRawTransaction(signedTxn).do();
    let confirmedTxn = await waitForConfirmation(algodV2, txId, 4);
    if (callback) {
      const txRecord = {
        "chain": "ALGO",
        "sender": sender.account.addr,
        "receiver": receiver,
        "amount": amount,
        "memo": memo,
        "txid": txId,
        "date": new Date(),
      };
      callback(txRecord);
    }
  } catch (err) {
    log({ description: 'submitAlgoTransaction', cause: err, location: 'algo' });
    return;
  }
};

/**
 * Wait until the transaction is confirmed or rejected, or until 'timeout'
 * number of rounds have passed.
 * @param {algosdk.Algodv2} algodClient the Algod V2 client
 * @param {string} txId the transaction ID to wait for
 * @param {number} timeout maximum number of rounds to wait
 * @return {Promise<*>} pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next timeout rounds
 */
 const waitForConfirmation = async function (algodClient, txId, timeout) {
    if (algodClient == null || txId == null || timeout < 0) {
        throw new Error("Bad arguments");
    }

    const status = (await algodClient.status().do());
    if (status === undefined) {
        throw new Error("Unable to get node status");
    }

    const startround = status["last-round"] + 1;
    let currentround = startround;

    while (currentround < (startround + timeout)) {
        const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
        if (pendingInfo !== undefined) {
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                return pendingInfo;
            } else {
                if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                    // If there was a pool error, then the transaction has been rejected!
                    throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
                }
            }
        }
        await algodClient.statusAfterBlock(currentround).do();
        currentround++;
    }
    throw new Error("Transaction " + txId + " not confirmed after " + timeout + " rounds!");
};

export { getAlgoAccountInfo, submitAlgoTransaction };
