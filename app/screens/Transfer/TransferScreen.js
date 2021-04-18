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
import { log } from '../../logger/logger';

const TransferScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccountName, setToAccountName] = useState('');
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
    navigation: { navigate },
    accountsState: { accounts, addresses },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

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
      .then(json => processToPubkeyUpdate(json.public_address))
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
    } else {
      setIsFioAddress(false);
      setAddressInvalidMessage('');
    }
    setToAccountName(value);
  };

  const _callback = txid => {
    Alert.alert('Transfer completed: ' + txid);
    navigate('Accounts');
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
    if (!fromAccount || !toAccountName || !amount) {
      Alert.alert(
        'Please select from and to account as well as amount for transfer',
      );
      return;
    }

    // Validate amount:
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
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
          return;
        }
      } catch (e) {
        Alert.alert('Please input valid account name');
        return;
      }
    }

    setLoading(true);
    // From account validation
    try {
      if (fromAccount.chainName === 'ALGO') {
        let receiver = toPubkey ? toPubkey : toAccountName;
        await submitAlgoTransaction(
          fromAccount,
          receiver,
          floatAmount,
          memo,
          _callback,
        );
      } else if (fromAccount.chainName === 'FIO') {
        await sendFioTransfer(
          fromAccount,
          toPubkey,
          floatAmount,
          memo,
          _callback,
        );
      } else if (chain) {
        // Any of supported EOSIO chains:
        await transfer(actorName, floatAmount, memo, fromAccount, chain);
        Alert.alert('Transfer completed!');
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
        location: 'ViewFIORequestScreen',
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
                  item.chainName !== 'FIO' ? item.accountName : item.address
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
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(TransferScreen);
