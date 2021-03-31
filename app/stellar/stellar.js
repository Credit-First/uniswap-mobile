var StellarSdk = require("stellar-sdk");
import { log } from '../logger/logger';
import { Alert } from 'react-native';

var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const submitStellarTransaction = async (fromAccount, destination, amount, memo) => {

  if(!fromAccount) {
    Alert.alert('Missing from account');
    return;
  }

  var fromKeys = StellarSdk.Keypair.fromSecret(fromAccount.privateKey);

  server.loadAccount(destination).catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("The destination account does not exist!");
      log({
        description: 'submitStellarTransaction error: The destination account does not exist!',
        cause: error,
        location: 'stellar'
      });
      Alert.alert('The destination account does not exist!');
    } else {
      log({
        description: 'submitStellarTransaction error loading destination account',
        cause: error,
        location: 'stellar'
      });
      Alert.alert('Error loading destination account!');
    };
  }).then(function () {
    return server.loadAccount(fromKeys.publicKey());
  })
  .then(function (sourceAccount) {
    // Start building the transaction.
    var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    }).addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }),
      )
      .addMemo(StellarSdk.Memo.text(memo))
      .setTimeout(60) // 1 min timeout
      .build();
    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(fromKeys);
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log(result);
    Alert.alert('Stellar transaction submitted: ' + result);
  })
  .catch(function (error) {
    log({
      description: 'submitStellarTransaction error',
      cause: error,
      location: 'stellar'
    });
  });
};

export {
  submitStellarTransaction,
};
