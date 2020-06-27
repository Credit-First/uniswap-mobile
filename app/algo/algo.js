import algosdk from 'algosdk';

  const makeTransactionWithParams = (sender, receiver, amount, params) => {
    let transaction = algosdk.makePaymentTxn(sender.account.addr,
            receiver, params.minFee, amount * 1000, undefined,
            params.lastRound, params.lastRound + 1000, new Uint8Array(0),
            params.genesishashb64, params.genesisID);
    console.log(transaction);
    var sk = algosdk.mnemonicToMasterDerivationKey(sender.mnemonic);
    console.log(sk);
    let signedTx = transaction.signTxn(sk);
    console.log(signedTx);
    // Combine the signed transactions
    let signed = [];
    signed.push( signedTx );
    console.log(signed);
    //let tx = (await algodClient.sendRawTransaction(signed).do());
    //console.log("sent tx id: " + tx.txId);

    // Wait for transaction to be confirmed
    //await waitForConfirmation(algodClient, tx.txId)
  };

  const submitAlgoTransaction = async (sender, receiver, amount) => {
      fetch('https://algo.eostribe.io/v1/transactions/params')
        .then((response) => response.json())
        .then((json) => {
          makeTransactionWithParams(sender, receiver, amount, json);
        })
        .catch((error) => {
          console.error(error);
      });
  }

export {
  submitAlgoTransaction,
};
