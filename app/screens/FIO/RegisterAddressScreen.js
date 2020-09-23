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
import { KHeader, KInput, KText, KButton, InputAddress } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';
import { getEndpoint } from '../../eos/chains';


const RegisterAddressScreen = props => {
  const [name, setName] = useState();
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

  const _checkAvailable = async name => {
    if (name.indexOf('@') > 0) {
      name = name.replace('@','');
    }
    setName(name);
    setAvailable(false);
    let newAddress = name + '@tribe';
    setAddress(newAddress);
    if (name.length > 0) {
      setCheckState('Checking '+newAddress+' address ..');
      fetch(fioEndpoint+'/v1/chain/avail_check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_name: newAddress
        }),
      })
        .then(response => response.json())
        .then(json => updateAvailableState(json, undefined, newAddress))
        .catch(error => updateAvailableState({is_registered:-1}, error, newAddress));
    } else {
      setAvailable(false);
      setCheckState('');
    }
  };

  const updateAvailableState = (json, error, newAddress) => {
    let regcount = json.is_registered;
    if (regcount === 0) {
      setAvailable(true);
      setCheckState('Available: '+newAddress);
    } else if (regcount === 1) {
      setAvailable(false);
      setCheckState('Not available: '+newAddress);
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
      goBack();
    } else {
      json.method = 'connectFioAccount';
      json.address = fioAccount.address;
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
      console.log(fioAccount);
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
          <InputAddress onChange={_checkAvailable}/>
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
