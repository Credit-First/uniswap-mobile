var StellarSdk = require("stellar-sdk");
import { log } from '../logger/logger';
import { Alert } from 'react-native';

var server = new StellarSdk.Server("https://horizon.stellar.org");

const createKeyPair = () => {
  const pair = StellarSdk.Keypair.random();
  return pair;
}

const getKeyPair = (privateKey) => {
  return StellarSdk.Keypair.fromSecret(privateKey);
}

const loadAccount = async (address, callback) => {
  fetch('https://horizon.stellar.org/accounts/' + address, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(json => callback(json))
    .catch(error =>
      log({
        description:
          'Stellar - fetch https://horizon.stellar.org/accounts/' + address,
        cause: error,
        location: 'stellar.js',
      }),
    );
}

const createStellarAccount = async (fromAccount,
  destination,
  amount,
  memo,
  callback,) => {

    if(!fromAccount) {
      Alert.alert('Missing from account');
      return;
    }

    if(!amount || amount < 1) {
      Alert.alert('Minimum 1 XLM transfer required for new accounts');
      return;
    }

    const fromKeys = StellarSdk.Keypair.fromSecret(fromAccount.privateKey);
    const fromAddress = fromKeys.publicKey();

  server.loadAccount(fromAddress)
    .then(
        account => {
          var transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.PUBLIC,
          }).addOperation(
              StellarSdk.Operation.createAccount({
                destination: destination,
                startingBalance: amount.toString(),
              })
            )
            .addMemo(StellarSdk.Memo.text(memo))
            .setTimeout(60) // 1 min timeout
            .build();
          // Sign the transaction to prove you are actually the person sending it.
          transaction.sign(fromKeys);
          // And finally, send it off to Stellar!
          return server.submitTransaction(transaction)
            .then(function (result) {
              //console.log(result);
              if (callback) {
                callback(result);
              }
              Alert.alert('Stellar account created: ' + result);
            })
            .catch(function (error) {
              log({
                description: 'createStellarAccount error',
                cause: error,
                location: 'stellar'
              });
            });
        }
    );
}

const submitStellarPayment = async (fromAccount,
  destination,
  amount,
  memo,
  callback, ) => {

  if(!fromAccount) {
    Alert.alert('Missing from account');
    return;
  }

  var fromKeys = StellarSdk.Keypair.fromSecret(fromAccount.privateKey);

  server.loadAccount(destination).catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("The destination account does not exist!");
      log({
        description: 'submitStellarPayment error: The destination account does not exist!',
        cause: error,
        location: 'stellar'
      });
      Alert.alert('The destination account does not exist!');
    } else {
      log({
        description: 'submitStellarPayment error loading destination account',
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
      networkPassphrase: StellarSdk.Networks.PUBLIC,
    }).addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
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
    //console.log(result);
    if (callback) {
      callback(result);
    }
    Alert.alert('Stellar payment submitted: ' + result);
  })
  .catch(function (error) {
    log({
      description: 'submitStellarPayment error',
      cause: error,
      location: 'stellar'
    });
  });
};



export {
  createStellarAccount,
  submitStellarPayment,
  createKeyPair,
  getKeyPair,
  loadAccount
};
