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
import { fioNewFundsRequest } from '../../eos/fio';
import ecc from 'eosjs-ecc-rn';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { supportedChains, getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const FIORequestScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [validToAccount, setValidToAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();
  const [chain, setChain] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [fioFee, setFioFee] = useState(0);
  const [fioPubkey, setFioPubkey] = useState(); // payee public key

  const {
    navigation: { navigate, goBack },
    accountsState: { accounts },
  } = props;

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  const _handleFromAccountChange = value => {
    setFromAccount(value);
    getFee(value.address);
  };

  const getFee = address => {
    console.log("Get fee for "+address);
    fetch('http://fio.eostribe.io/v1/chain/get_fee', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        end_point: 'add_pub_address',
        fio_address: address,
      }),
    })
      .then(response => response.json())
      .then(json => setFioFee(json.fee))
      .catch(error => console.error(error));
  };

  const getFioPubkey = async address => {
    fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": address,
        "chain_code": "FIO",
        "token_code": "FIO"
      }),
    })
      .then(response => response.json())
      .then(json => setFioPubkey(json.public_address))
      .catch(error => console.log(error));
  }

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
      setValidToAccount(address);
      getFioPubkey(address);
    } else if (error) {
      console.error(error);
      setAddressInvalidMessage('Error validating address');
    }
  };

  const _handleSubmit = async () => {
    if (!fromAccount || !validToAccount || !chain || !amount || !fioPubkey) {
      Alert.alert("Please fill all required fields including valid payee address!");
      return;
    }
    try {
      const res = await fioNewFundsRequest(fromAccount,
        validToAccount,
        fioPubkey, // To account public key
        chain.symbol,
        amount,
        memo,
        fioFee);
      //console.log(res);
      Alert.alert("FIO Request sent!");
    } catch (e) {
      Alert.alert(e.message);
    }
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
            title={'FIO Request'}
            subTitle={'Request for payment from another FIO address'}
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
            label={'Coin requested'}
            items={supportedChains.map(chain => ({
              label: `${chain.symbol}`,
              value: chain,
            }))}
            onValueChange={setChain}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Amount to request'}
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

export default connectAccounts()(FIORequestScreen);
