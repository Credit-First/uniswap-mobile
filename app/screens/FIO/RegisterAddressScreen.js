import React, { useState } from 'react';
import { SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  Linking } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ecc from 'eosjs-ecc-rn';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import styles from './RegisterAddress.style';
import { KHeader, KInput, KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';
import { getEndpoint } from '../../eos/chains';


const RegisterAddressScreen = props => {
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState('');
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const fioEndpoint = getEndpoint('FIO');
  const apiToken = 'YCDPh0ni7MMwrAXa1eerq3JBBFWHDjgd6RbflXVAg653Zh0';

  const _checkAvailable = async address => {
    setAddress(address);
    setAvailable(false);
    if (address.length > 6 && address.endsWith('@tribe')) {
      setCheckState('Checking address..');
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
    } else {
      setCheckState('Incomplete address: [name]@tribe');
    }
  };

  const updateAvailableState = (json, error) => {
    log({
      description: 'FIO address registration check '+ (error)?error:'',
      cause: json,
      location: 'RegisterAddressScreen'
    });
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
    //console.log(json);
    setLoading(false);
    if(json.success) {
      connectAccount(fioAccount);
      Alert.alert('Registered '+fioAccount.address+' in TX '+json.account_id);
    } else {
      reportError(json);
    }
  };

  const reportError = (error) => {
    setLoading(false);
    Alert.alert('Failed to register FIO address with error '+error.error);
    log({
      description: 'FIO address registration error',
      cause: error,
      location: 'RegisterAddressScreen'
    })
  };

  const _nextRegister = async () => {
    setLoading(true);
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
          <KText style={styles.errorMessage}>{checkState}</KText>
          <KButton
            title={'Register address'}
            theme={'blue'}
            style={styles.button}
            icon={'check'}
            onPress={_nextRegister}
            isLoading={loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(RegisterAddressScreen);
