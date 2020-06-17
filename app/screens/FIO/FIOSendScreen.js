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
import { getAccount } from '../../eos/eos';
import { supportedChains, getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const FIOSendScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();
  const [chain, setChain] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');

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

  const _handleCoinChange = value => {
    const chain = getChain(value);
    setChain(chain);
  };

  const _handleSubmit = () => {
    console.log("Submit");
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
            onValueChange={_handleCoinChange}
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
            onPress={_handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );

};

export default connectAccounts()(FIOSendScreen);
