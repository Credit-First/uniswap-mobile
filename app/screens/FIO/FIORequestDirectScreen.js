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

const FIORequestDirectScreen = props => {
  const [coin, setCoin] = useState();
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [fioFee, setFioFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
    route: {
      params: { fromFioAccount, toFioAddress },
    },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

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
          description:
            'getFee - fetch http://fio.greymass.com/v1/chain/get_fee',
          cause: error,
          location: 'FIORequestScreen',
        }),
      );
  };

  const _handleSubmit = async () => {
    if (!fromFioAccount || !toFioAddress || !coin || !amount) {
      Alert.alert('Please fill all required fields!');
      return;
    }
    try {
      setLoading(true);
      const res = await fioNewFundsRequest(
        fromFioAccount,
        toFioAddress.address,
        toFioAddress.publicKey,
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

  if (fromFioAccount.address) {
    getFee(fromFioAccount.address);
  }

  const _handleFIOSend = () => {
    navigate('FIOSendDirect', { fromFioAccount, toFioAddress });
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
          <KText>From address: {fromFioAccount.address}</KText>
          <KText>To address: {toFioAddress.address}</KText>
          <KInput
            label={'Coin/token requested'}
            placeholder={'Enter requested coin: EOS, BTC, ETH, BNB, etc'}
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
          <KButton
            title={'FIO Send'}
            theme={'brown'}
            style={styles.button}
            icon={'check'}
            isLoading={loading}
            onPress={_handleFIOSend}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(FIORequestDirectScreen);
