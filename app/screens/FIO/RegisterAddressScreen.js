import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Linking } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ecc from 'eosjs-ecc-rn';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import styles from './RegisterAddress.style';
import { KHeader, KInput, KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';
import { getAvailableEndpoint } from '../../eos/chains';


const RegisterAddressScreen = props => {
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [checkState, setCheckState] = useState('Checking');
  const [fioEndpoint, setFioEndpoint] = useState();
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const apiToken = 'YCDPh0ni7MMwrAXa1eerq3JBBFWHDjgd6RbflXVAg653Zh0';

  const _checkAvailable = async address => {
    setAddress(address);
    setAvailable(false);
    setCheckState('Checking');
    if (address.length > 6 && address.endsWith('@tribe')) {
      if(!fioEndpoint) { setFioEndpoint(await getAvailableEndpoint('FIO')); }
      console.log(fioEndpoint+'/v1/chain/avail_check: '+address);
      fetch(fioEndpoint+'/v1/chain/avail_check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_name: address
        }),
      })
        .then(response => response.json())
        .then(json => updateAvailableState(json))
        .catch(error => updateAvailableState({is_registered:-1}, error));
    }
  };

  const updateAvailableState = (json, error) => {
    console.log(json);
    let regcount = json.is_registered;
    if (regcount === 0) {
      setAvailable(true);
      setCheckState('Available');
    } else if (regcount === 1) {
      setAvailable(false);
      setCheckState('Not available');
    } else {
      setAvailable(false);
      setCheckState('Error');
      log({ description: 'updateAvailableState', cause: error, location: 'RegisterAddressScreen'});
    }
  };

  const connectFioAccount = (json, fioAccount) => {
    if(json.success) {
      connectAccount(fioAccount);
      Alert.alert('Registered '+fioAccount.address+' in TX '+json.account_id);
    } else {
      reportError(json);
    }
  };

  const reportError = (error) => {
    Alert.alert('Failed to register FIO address with error '+error);
    log({
      description: 'FIO address registration error',
      cause: error,
      location: 'RegisterAddressScreen'
    })
  };

  const _nextRegister = async () => {
    ecc.randomKey().then(privateKey => {
      const fioPubkey = Ecc.privateToPublic(privateKey);
      const fioAccount = { address, privateKey, chainName: 'FIO' };
      fetch('https://reg.fioprotocol.io/public-api/buy-address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "referralCode":"tribe",
          "publicKey":fioPubkey,
          "address":address,
          "apiToken":apiToken
        }),
      })
        .then(response => response.json())
        .then(json => connectFioAccount(json, fioAccount))
        .catch(error => reportError(error));
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
