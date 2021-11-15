import React, { useState } from 'react';
import { Fio } from '@fioprotocol/fiojs';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './TransferScreen.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { sendFioTransfer } from '../../eos/fio';
import { submitAlgoTransaction } from '../../algo/algo';
import { getChain, getEndpoint } from '../../eos/chains';
import { loadAccount, submitStellarPayment, createStellarAccount } from '../../stellar/stellar';
import { log } from '../../logger/logger';

const TransferScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccountName, setToAccountName] = useState('');
  const [isLiveStellarAccount, setIsLiveStellarAccount] = useState(false);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [toFioAddress, setToFioAddress] = useState();
  const [isFioAddress, setIsFioAddress] = useState(false);
  const [toActor, setToActor] = useState('');
  const [toPubkey, setToPubkey] = useState('');
  const [toFioPubkey, setToFioPubkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    addAddress,
    addHistory,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

  const isValidXLMAddress = address => {
    return (address != null && address.startsWith('G') && address.length == 56);
  }

  const processToPubkeyUpdate = async toAccountPubkey => {
    const chain = getChain(fromAccount.chainName);
    if (chain && chain.name === 'FIO') {
      setToActor('');
      setToPubkey(toAccountPubkey);
    } else if (chain) {
      // EOSIO chain
      const [toActorValue, toPubkeyValue] = toAccountPubkey.split(',');
      const toAccountInfo = await getAccount(toActorValue, chain);
      if (!toAccountInfo) {
        Alert.alert(
          'Error fetching account data for ' +
            toActor +
            ' on chain ' +
            fromAccount.chainName,
        );
        return;
      }
      setToActor(toActorValue);
      setToPubkey(toPubkeyValue);
    } else {
      // Non EOSIO chain - no 'actor,pubkey' split
      setToActor('');
      setToPubkey(toAccountPubkey);
    }
  };

  const loadToPubkey = async address => {
    let chainCode =
      fromAccount.chainName === 'Telos' ? 'TLOS' : fromAccount.chainName;
    fetch(fioEndpoint + '/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_address: address,
        chain_code: chainCode,
        token_code: chainCode,
      }),
    })
      .then(response => response.json())
      .then(json => {
        processToPubkeyUpdate(json.public_address);
      })
      .catch(error =>
        log({
          description:
            'loadToPubkey - fetch [' +
            chainCode +
            '] ' +
            fioEndpoint +
            '/v1/chain/get_pub_address [' +
            address +
            ']',
          cause: error,
          location: 'TransferScreen',
        }),
      );
    // Load FIO public key as well:
    if (chainCode !== 'FIO') {
      fetch(fioEndpoint + '/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_address: address,
          chain_code: 'FIO',
          token_code: 'FIO',
        }),
      })
        .then(response => response.json())
        .then(json => setToFioPubkey(json.public_address))
        .catch(error =>
          log({
            description:
              'loadToPubkey - fetch [FIO] ' +
              fioEndpoint +
              '/v1/chain/get_pub_address [' +
              address +
              ']',
            cause: error,
            location: 'TransferScreen',
          }),
        );
    }
  };

  const _validateAddress = address => {
    if (
      address.length >= 3 &&
      address.indexOf('@') > 0 &&
      address.indexOf('@') < address.length - 1
    ) {
      fetch(fioEndpoint + '/v1/chain/avail_check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_name: address,
        }),
      })
        .then(response => response.json())
        .then(json => updateAvailableState(json.is_registered, address))
        .catch(error => updateAvailableState(-1, address, error));
    }
  };

  const _validateStellarAddress = address => {
    const callback = json => {
      if(json["status"] && json["status"] === 404) {
        setIsLiveStellarAccount(false);
      } else if(json['balances']) {
        setIsLiveStellarAccount(true);
      } else {
        setIsLiveStellarAccount(false);
      }
    };
    if(isValidXLMAddress(address)) {
      loadAccount(address, callback);
    }
  };

  const updateAvailableState = (regcount, address, error) => {
    if (regcount === 0) {
      setAddressInvalidMessage('Invalid FIO address!');
      setToPubkey('');
    } else if (regcount === 1) {
      setAddressInvalidMessage('');
      loadToPubkey(address);
    } else if (error) {
      setToPubkey('');
      setAddressInvalidMessage('Error validating FIO address');
      log({
        description:
          '_validateAddress - fetch ' + fioEndpoint + '/v1/chain/avail_check',
        cause: error,
        location: 'TransferScreen',
      });
    }
  };

  const _handleFromAccountChange = value => {
    setFromAccount(value);
    if (value && value.chainName !== 'FIO') {
      setAddressInvalidMessage('');
    }
  };

  const _handleToAccountChange = value => {
    if (!fromAccount) {
      Alert.alert('Select from account first!');
      return;
    }
    // trim white space if present:
    if(value.indexOf(' ') >= 0) {
      value = value.trim();
    }
    // Then validate FIO address (if set):
    if (fromAccount.chainName === 'FIO') {
      if (value && value.indexOf('@') > 0) {
        _validateAddress(value);
        setIsFioAddress(true);
        setToFioAddress(value);
      } else if (value && value.startsWith('FIO') && value.length > 10) {
        setIsFioAddress(false);
        setToPubkey(value);
        setAddressInvalidMessage('');
      } else {
        setIsFioAddress(false);
        setAddressInvalidMessage(
          'Must be FIO address or public key for FIO transfer!',
        );
      }
    } else if (value.indexOf('@') > 0) {
      _validateAddress(value);
      setIsFioAddress(true);
      setToFioAddress(value);
    } else if (fromAccount.chainName === 'XLM') {
      setIsFioAddress(false);
      setToFioAddress('');
      setAddressInvalidMessage('');
      _validateStellarAddress(value);
    } else {
      setIsFioAddress(false);
      setToFioAddress('');
      setAddressInvalidMessage('');
    }
    setToAccountName(value);
  };

  const addTransactionToHistory = transaction => {
    transaction.isFioAddress = isFioAddress;
    transaction.toFioAddress = toFioAddress;
    addHistory(transaction);
    Alert.alert('Transfer completed: ' + transaction.txid);
    navigate('Transactions');
  };

  const addFIOAddressToAddressbook = () => {
    if (toFioAddress && toFioPubkey) {
      let accountHash = Fio.accountHash(toFioPubkey);
      let name = toFioAddress.split('@')[0];
      let addressJson = {
        name: name,
        address: toFioAddress,
        actor: accountHash,
        publicKey: toFioPubkey,
      };
      let matchingAddresses = addresses.filter(
        (item, index) => item.address === toFioAddress,
      );
      if (matchingAddresses.length === 0) {
        addAddress(addressJson);
      }
    } else {
      log({
        description:
          'addFIOAddressToAddressbook: Failed to load To FIO address and public key',
        cause: 'Failed to load To FIO address and public key',
        location: 'TransferScreen',
      });
    }
  };

  const _handleTransfer = async () => {
    setLoading(true);

    if (!fromAccount || !toAccountName || !amount) {
      Alert.alert(
        'Please select from and to account as well as amount for transfer',
      );
      setLoading(false);
      return;
    }

    // Validate amount:
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
      setLoading(false);
      return;
    }

    // EOSIO chain (undefined for not EOSIO account)
    let chain = getChain(fromAccount.chainName);

    // If to account is FIO address:
    if (isFioAddress) {
      if (!toPubkey) {
        await _validateAddress(toAccountName);
      }
      if (!toPubkey) {
        Alert.alert(
          'Could not determine receiver public key for ' +
            fromAccount.chainName +
            ' registered to ' +
            toAccountName,
        );
        setLoading(false);
        return;
      }
      // Add FIO address to addressbook:
      addFIOAddressToAddressbook();
    }

    // EOSIO to actor name validation:
    let actorName = isFioAddress ? toActor : toAccountName;
    if (chain && chain.name !== 'FIO') {
      try {
        let toAccount = await getAccount(actorName, chain);
        if (!toAccount) {
          Alert.alert('Please input valid account name');
          setLoading(false);
          return;
        }
      } catch (e) {
        Alert.alert('Please input valid account name');
        setLoading(false);
        return;
      }
    }

    // From account validation
    try {
      setLoading(true);
      if (fromAccount.chainName === 'ALGO') {
        let receiver = toPubkey ? toPubkey : toAccountName;
        await submitAlgoTransaction(
          fromAccount,
          receiver,
          floatAmount,
          memo,
          addTransactionToHistory,
        );
      } else if (fromAccount.chainName === 'XLM') {
        let receiver = toPubkey ? toPubkey : toAccountName;
        if(isValidXLMAddress(receiver)) {
          if(isLiveStellarAccount) {
            await submitStellarPayment(
              fromAccount,
              receiver,
              floatAmount,
              memo,
              addTransactionToHistory,
            );
          } else {
            //Double check isLiveStellarAccount for FIO use case:
            const callback = async json => {
              // XLM address doesn't exists
              if(json["status"] && json["status"] === 404) {
                setIsLiveStellarAccount(false);
                await createStellarAccount(
                  fromAccount,
                  receiver,
                  floatAmount,
                  memo,
                  addTransactionToHistory,
                );
              } else { // Address exists:
                setIsLiveStellarAccount(true);
                await submitStellarPayment(
                  fromAccount,
                  receiver,
                  floatAmount,
                  memo,
                  addTransactionToHistory,
                );
              }
            };
            loadAccount(receiver, callback);
          }
        } else {
          Alert.alert('Invalid XLM to address: '+receiver);
        }
      } else if (fromAccount.chainName === 'FIO') {
        await sendFioTransfer(
          fromAccount,
          toPubkey,
          floatAmount,
          memo,
          addTransactionToHistory,
        );
      } else if (chain) {
        // Any of supported EOSIO chains:
        let result = await transfer(actorName, floatAmount, memo, fromAccount, chain);
        const txRecord = {
          "chain": chain.name,
          "sender": fromAccount.accountName,
          "receiver": actorName,
          "amount": floatAmount,
          "memo": memo,
          "isFioAddress": isFioAddress,
          "toFioAddress": toFioAddress,
          "txid": result.transaction_id,
          "date": new Date(),
        };
        addTransactionToHistory(txRecord);
      } else {
        Alert.alert('Unsupported transfer state!');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({
        description: '_handleTransfer - transfer: ' + fromAccount.chainName,
        cause: err.message,
        location: 'TransferScreen',
      });
    } finally {
      setLoading(false);
    }
  };

  if (accounts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContentContainer}
          enableOnAndroid>
          <View style={styles.inner}>
            <KHeader
              title={'Transfer not available'}
              subTitle={'No accounts in wallet'}
              style={styles.header}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContentContainer}
          enableOnAndroid>
          <View style={styles.inner}>
            <KHeader
              title={'Transfer coins'}
              subTitle={'Move funds to another account'}
              style={styles.header}
            />
            <KSelect
              label={'From account'}
              items={accounts.map(item => ({
                label: `${item.chainName}: ${
                  (item.chainName === 'FIO'||item.chainName === 'XLM') ? item.address : item.accountName
                }`,
                value: item,
              }))}
              onValueChange={_handleFromAccountChange}
              containerStyle={styles.inputContainer}
            />
            <KInput
              label={'Sending to'}
              placeholder={'Enter either direct or FIO address'}
              value={toAccountName}
              onChangeText={_handleToAccountChange}
              containerStyle={styles.inputContainer}
              onPasteHandler={_handleToAccountChange}
              autoCapitalize={'none'}
            />
            <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
            <KInput
              label={'Amount to send'}
              placeholder={'Enter amount to send'}
              value={amount}
              onChangeText={setAmount}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
            />
            <KInput
              label={'Memo'}
              placeholder={'Optional memo'}
              value={memo}
              onChangeText={setMemo}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <View style={styles.spacer} />
            <KButton
              title={'Submit transfer'}
              theme={'blue'}
              style={styles.button}
              isLoading={loading}
              renderIcon={() => (
                <Image
                  source={require('../../../assets/icons/transfer.png')}
                  style={styles.buttonIcon}
                />
              )}
              onPress={_handleTransfer}
            />
            <View style={styles.spacer} />
            <KButton
              title={'Past transfers'}
              theme={'brown'}
              style={styles.button}
              renderIcon={() => (
                <Image
                  source={require('../../../assets/icons/transactions.png')}
                  style={styles.buttonIcon}
                />
              )}
              onPress={() => navigate('Transactions')}
            />
            <View style={styles.spacer} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(TransferScreen);
