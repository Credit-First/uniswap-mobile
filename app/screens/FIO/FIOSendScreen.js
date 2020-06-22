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
import { supportedChains, getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const FIOSendScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();
  const [chain, setChain] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    navigation: { navigate, goBack },
    accountsState: { accounts },
  } = props;

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  const _handleFromAccountChange = value => {
    setFromAccount(value);
  };

  const _validateAddress = address => {
    if (address.length >= 3 && address.indexOf('@') > 0 && address.indexOf('@') < address.length-1) {
      fetch('http://fio.eostribe.io/v1/chain/avail_check', {
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
      setToAccount(address);
    } else if (error) {
      console.error(error);
      setAddressInvalidMessage('Error validating address');
    }
  };

  const handleFromToAccountTransfer = async (toAccountName, actorPubkey) => {
    const [actor, pubkey] = actorPubkey.split(',');
    try {
      // Load account info:
      const fromAccountInfo = await getAccount(actor, chain);
      if (!fromAccountInfo) {
        Alert.alert('Error fetching account data for '+actor+' on chain '+chain.name);
        return;
      }
      const activeAccounts = accounts.filter((value, index, array) => {
        return value.accountName === actor && value.chainName === chain.name;
      });
      if (activeAccounts[0] < 1) {
        Alert.alert('Could not find matching account to send transfer from in this wallet');
        return;
      }
      // Check amount
      const floatAmount = parseFloat(amount);
      if (isNaN(floatAmount)) {
        Alert.alert('Invalid transfer amount '+floatAmount);
        return;
      }
      // Now do transfer:
      setLoading(true);
      try {
        const res = await transfer(toAccountName,
          floatAmount,
          memo,
          activeAccounts[0],
          chain);
        //console.log(res);
        if (res) {
          Alert.alert('Transfer completed!');
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Alert.alert(e.message);
      }

    } catch (e) {
      Alert.alert('Error: '+e);
      console.log(e);
      return;
    }
  };

  const handleToAccountAddress = async (actorPubkey) => {
    const [actor, pubkey] = actorPubkey.split(',');
    try {
      const toAccount = await getAccount(actor, chain);
      if (!toAccount) {
        Alert.alert('Error fetching account data for '+actor+' on chain '+chain.name);
        return;
      }
      // Now load corresponding from account
      fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "fio_address": fromAccount.address,
          "chain_code": chain.symbol,
          "token_code": chain.symbol
        }),
      })
      .then(response => response.json())
      .then(json => handleFromToAccountTransfer(actor, json.public_address))
      .catch(error => Alert.alert('Error fetching payer public address for '+chain.name));

    } catch (e) {
      Alert.alert('Error: '+e);
      console.log(e);
      return;
    }
  };

  const _handleSubmit = () => {
    if (!fromAccount || !toAccount || !chain || !amount) {
      Alert.alert("Please fill all required fields including valid payee address!");
      return;
    }
    // Load toAccount actor,publicKey:
    fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": toAccount,
        "chain_code": chain.symbol,
        "token_code": chain.symbol
      }),
    })
    .then(response => response.json())
    .then(json => handleToAccountAddress(json.public_address))
    .catch(error => Alert.alert('Error fetching payee public address for '+chain.name));
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
            items={supportedChains.map(chain => ({
              label: `${chain.symbol}`,
              value: chain,
            }))}
            onValueChange={setChain}
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
          <View style={styles.spacer} />
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
