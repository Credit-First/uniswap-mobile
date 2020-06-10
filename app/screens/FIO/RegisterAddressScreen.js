import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get } from 'lodash';

import styles from './RegisterAddress.style';
import { KHeader, KInput, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const { Fio, Ecc } = require('@fioprotocol/fiojs');

const RegisterAddressScreen = props => {
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [checkState, setCheckState] = useState('Checking');
  const {
    accountsState: { accounts, activeAccountIndex },
    navigation: { goBack },
  } = props;

  const _checkAvailable = address => {
    setAddress(address);
    setAvailable(false);
    setCheckState('Checking');
    if (address.length > 6 && address.endsWith('@tribe')) {
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
        .then(json => updateAvailableState(json.is_registered, false))
        .catch(error => updateAvailableState(-1, error));
    }
  };

  const updateAvailableState = (regcount, error) => {
    if (regcount === 0) {
      setAvailable(true);
      setCheckState('Available');
    } else if (regcount === 1) {
      setAvailable(false);
      setCheckState('Not available');
    } else if (error) {
      console.error(error);
      setAvailable(false);
      setCheckState('Error');
    }
  };

  const _nextRegister = () => {
    console.log(address);
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
            title={'Register new address'}
            subTitle={'Register new FIO address under @tribe domain'}
            style={styles.header}
          />
          <KInput
            label={'Address'}
            placeholder={'[name]@tribe'}
            value={address}
            onChangeText={_checkAvailable}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <View style={styles.spacer} />
          <KButton
            title={checkState}
            theme={'blue'}
            style={styles.button}
            icon={'check'}
            onPress={_nextRegister}
            isLoading={!available}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(RegisterAddressScreen);
