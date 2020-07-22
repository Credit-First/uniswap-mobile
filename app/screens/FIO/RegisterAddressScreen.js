import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Linking } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ecc from 'eosjs-ecc-rn';
import styles from './RegisterAddress.style';
import { KHeader, KInput, KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';
;

const RegisterAddressScreen = props => {
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [checkState, setCheckState] = useState('Checking');
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const _checkAvailable = address => {
    setAddress(address);
    setAvailable(false);
    setCheckState('Checking');
    if (address.length > 6 && address.endsWith('@tribe')) {
      fetch('http://fio.greymass.com/v1/chain/avail_check', {
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
      setAvailable(false);
      setCheckState('Error');
      log({ description: 'updateAvailableState', cause: error, location: 'RegisterAddressScreen'});
    }
  };

  const _nextRegister = () => {
    ecc.randomKey().then(privateKey => {
      const pubKey = ecc.privateToPublic(privateKey);
      const fioKey = 'FIO' + pubKey.substring(3);
      connectAccount({ address, privateKey, chainName: 'FIO' });
      var registerUrl =
        'https://reg.fioprotocol.io/ref/tribe?publicKey=' + fioKey;
      Linking.openURL(registerUrl);
      goBack();
    });
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
          <View style={styles.spacer} />
          <KText>
            Clicking on above button you will be taken to FIO registration site.
          </KText>
          <View style={styles.spacer} />
          <KText>
            Please enter the same address and pay FIO registration fee using any
            one of methods provided.
          </KText>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(RegisterAddressScreen);
