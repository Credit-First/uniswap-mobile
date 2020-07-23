import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { submitAlgoTransaction } from '../../algo/algo';
import {
  supportedChains,
  getChain,
  getEndpoint } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';


const FIOSendScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [validToAccount, setValidToAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();
  const [chainName, setChainName] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'FIO';
  });

  const importedAccounts = accounts.filter((value, index, array) => {
    return value.chainName !== 'FIO' && array.indexOf(value) === index;
  });

  const _handleFromAccountChange = value => {
    setFromAccount(value);
  };

  const _validateAddress = async address => {
    if (address.length >= 3 && address.indexOf('@') > 0 && address.indexOf('@') < address.length-1) {
      fetch(fioEndpoint+'/v1/chain/avail_check', {
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
      setAddressInvalidMessage('Invalid address!');
    } else if (regcount === 1) {
      setAddressInvalidMessage('');
      setValidToAccount(address);
    } else if (error) {
      setAddressInvalidMessage('Error validating address');
    }
  };

  const doEOSIOTransfer = async (toAccountPubkey, fromAccountPubkey) => {
    const chain = getChain(chainName);
    // To EOSIO Account record:
    const [toActor, toPubkey] = toAccountPubkey.split(',');
    const toAccountInfo = await getAccount(toActor, chain);
    if (!toAccountInfo) {
      Alert.alert('Error fetching account data for '+toActor+' on chain '+chainName);
      return;
    }
    // From EOSIO Account record:
    const [fromActor, fromPubkey] = fromAccountPubkey.split(',');
    const fromAccountInfo = await getAccount(fromActor, chain);
    if (!fromAccountInfo) {
      Alert.alert('Error fetching account data for '+fromActor+' on chain '+chainName);
      return;
    }
    // Find matching active account:
    const activeAccounts = accounts.filter((value, index, array) => {
      return value.accountName === fromActor && value.chainName === chainName;
    });
    if (activeAccounts.length === 0) {
      Alert.alert('Could not find matching account to send transfer from in this wallet');
      return;
    }
    const fromAccount = activeAccounts[0];
    // Check amount
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Invalid transfer amount '+floatAmount);
      return;
    }
    // Now do transfer
    try {
      const res = await transfer(toActor,
        floatAmount,
        memo,
        fromAccount,
        chain);
        if (res && res.transaction_id) {
          Alert.alert("Transfer completed in tx "+res.transaction_id);
        } else {
    			Alert.alert("Something went wrong: "+res.message);
    		}
    } catch(err) {
      Alert.alert('Transfer failed: '+err);
      log({ description: 'doEOSIOTransfer', cause: err, location: 'FIOSendScreen'});
    }
  };

  const doAlgoTransfer = async (toAccountPubkey, fromAccountPubkey) => {
    // Find imported matching from account:
    const activeAccounts = accounts.filter((value, index, array) => {
      return value.chainName === 'ALGO' && value.account.addr === fromAccountPubkey;
    });
    if (activeAccounts.lnegth === 0) {
      Alert.alert('Could not find imported Algo account to pubkey '+fromAccountPubkey);
      return;
    }
    const fromAccount = activeAccounts[0];
    // Check amount
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Invalid transfer amount '+floatAmount);
      return;
    }
    submitAlgoTransaction(fromAccount, toAccountPubkey, floatAmount, memo);
    Alert.alert('Transfer completed!');
  };

  const handleFromToAccountTransfer = async (toAccountPubkey, fromAccountPubkey) => {
    try {
        setLoading(true);
        if (chainName === 'ALGO') {
          doAlgoTransfer(toAccountPubkey, fromAccountPubkey);
        } else { // Any of EOSIO based chains:
          doEOSIOTransfer(toAccountPubkey, fromAccountPubkey);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Alert.alert(e.message);
      }
  };

  const handleToAccountAddress = async (toAccountPubkey) => {
    try {
      fetch(fioEndpoint+'/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "fio_address": fromAccount.address,
          "chain_code": chainName,
          "token_code": chainName
        }),
      })
      .then(response => response.json())
      .then(json => handleFromToAccountTransfer(toAccountPubkey, json.public_address))
      .catch(error => Alert.alert('Error fetching payer public address for '+chainName));
    } catch (err) {
      Alert.alert('Error: '+err);
      log({ description: '_handleSubmit', cause: err, location: 'FIOSendScreen'});
      return;
    }
  };

  const _handleSubmit = async () => {
    if (!fromAccount || !validToAccount || !chainName || !amount) {
      Alert.alert("Please fill all required fields including valid payee address!");
      return;
    }
    // Load toAccount actor,publicKey:
    fetch(fioEndpoint+'/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": validToAccount,
        "chain_code": chainName,
        "token_code": chainName
      }),
    })
    .then(response => response.json())
    .then(json => handleToAccountAddress(json.public_address))
    .catch(error => Alert.alert('Error fetching payee public address for '+chainName));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
              />
          </TouchableOpacity>
          <KHeader
            title={'FIO Send payment'}
            subTitle={'Send payment to another FIO address'}
            style={styles.header}
          />
          <KSelect
            label={'From address'}
            items={fioAccounts.map(item => ({
              label: `${item.chainName}: ${item.address}`,
              value: item,
            }))}
            onValueChange={_handleFromAccountChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'To address'}
            placeholder={'Enter FIO address'}
            value={toAccount}
            onChangeText={_validateAddress}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
          <KSelect
            label={'Coin to send'}
            items={importedAccounts.map(item => ({
              label: `${item.chainName}`,
              value: `${item.chainName}`,
            }))}
            onValueChange={setChainName}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Amount to send'}
            placeholder={'Enter requested amount'}
            value={amount}
            onChangeText={setAmount}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KInput
            label={'Memo'}
            placeholder={'Enter memo'}
            value={memo}
            multiline={true}
            onChangeText={setMemo}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KButton
            title={'Submit'}
            theme={'blue'}
            style={styles.button}
            icon={'check'}
            isLoading={loading}
            onPress={_handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );

};

export default connectAccounts()(FIOSendScreen);
