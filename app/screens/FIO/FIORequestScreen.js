import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioNewFundsRequest } from '../../eos/fio';
import ecc from 'eosjs-ecc-rn';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain, getEndpoint } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const FIORequestScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [validToAccount, setValidToAccount] = useState();
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();
  const [coin, setCoin] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [fioFee, setFioFee] = useState(0);
  const [fioPubkey, setFioPubkey] = useState(); // payee public key
  const [loading, setLoading] = useState(false);
  const {
    addAddress,
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  const _handleFromAccountChange = value => {
    setFromAccount(value);
    getFee(value.address);
  };

  const _handleSetCoin = value => {
    setCoin(value.toUpperCase());
  };

  const getFee = async address => {
    fetch(fioEndpoint + '/v1/chain/get_fee', {
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
      .catch(error =>
        log({
          description: 'getFee - fetch ' + fioEndpoint + '/v1/chain/get_fee',
          cause: error,
          location: 'FIORequestScreen',
        }),
      );
  };

  const getFioPubkey = async address => {
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
      .then(json => addFIOAddressToAddressbook(json.public_address, address))
      .catch(error =>
        log({
          description:
            'getFioPubkey - fetch ' + fioEndpoint + '/v1/chain/get_pub_address',
          cause: error,
          location: 'FIORequestScreen',
        }),
      );
  };

  const addFIOAddressToAddressbook = (fioPubKey, fioAddress) => {
    setFioPubkey(fioPubKey);
    let accountHash = Fio.accountHash(fioPubKey);
    let name = fioAddress.split('@')[0];
    let addressJson = {
      name: name,
      address: fioAddress,
      actor: accountHash,
      publicKey: fioPubKey,
    };
    let matchingAddresses = addresses.filter(
      (item, index) => item.address === fioAddress,
    );
    if (matchingAddresses.length === 0) {
      addAddress(addressJson);
    }
  };

  const _validateAddress = async address => {
    if (fioAccounts.length == 1 && !fromAccount) {
      _handleFromAccountChange(fioAccounts[0]);
    }
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
      setAddressInvalidMessage('Invalid address!');
    } else if (regcount === 1) {
      setAddressInvalidMessage('');
      setValidToAccount(address);
      getFioPubkey(address);
    } else if (error) {
      log({
        description: 'updateAvailableState - error validating address',
        cause: error,
        location: 'FIORequestScreen',
      });
      setAddressInvalidMessage('Error validating address');
    }
  };

  const _handleSubmit = async () => {
    if (!fromAccount || !validToAccount || !coin || !amount || !fioPubkey) {
      Alert.alert(
        'Please fill all required fields including valid payee address!',
      );
      return;
    }
    try {
      setLoading(true);
      const res = await fioNewFundsRequest(
        fromAccount,
        validToAccount,
        fioPubkey, // To account public key
        coin,
        amount,
        memo,
        fioFee,
      );
      setLoading(false);
      Alert.alert('FIO Request sent!');
      goBack();
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({
        description: '_handleSubmit - fioNewFundsRequest',
        cause: err,
        location: 'FIORequestScreen',
      });
    }
  };

  if (fioAccounts.length == 1) {
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
            <KText>From FIO address: {fioAccounts[0].address}</KText>
            <KInput
              label={'To address'}
              placeholder={'Enter FIO address'}
              value={toAccount}
              onChangeText={_validateAddress}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
            <KInput
              label={'Coin/token requested'}
              placeholder={'Enter requested coin: EOS, BTC, ETH, BNB, MATIC, etc'}
              value={coin}
              onChangeText={_handleSetCoin}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
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
  } else {
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
            <KInput
              label={'Coin/token requested'}
              placeholder={'Enter requested coin: EOS, BTC, ETH, BNB, MATIC, etc'}
              value={coin}
              onChangeText={_handleSetCoin}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
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
  }
};

export default connectAccounts()(FIORequestScreen);
