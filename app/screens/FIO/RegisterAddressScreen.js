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
import { PRIMARY_BLUE } from '../../theme/colors';
import { fioAddPublicAddress } from '../../eos/fio';
import { getEndpoint } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { log } from '../../logger/logger';


const chars = '12345abcdefghijklmnopqrstuvwxyz';

function randomName() {
    var result = '';
    for (var i = 12; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

const RegisterAddressScreen = props => {
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState('');
  const [fioAccount, setFioAccount] = useState();
  const [fioFee, setFioFee] = useState(0);
  const {
    connectAccount,
    navigation: { goBack },
  } = props;
  // FIO endpoint:
  const fioEndpoint = getEndpoint('FIO');
  const apiToken = 'YCDPh0ni7MMwrAXa1eerq3JBBFWHDjgd6RbflXVAg653Zh0';
  // Telos endpoint:
  const endpoint = getEndpoint('Telos');
  const newAccountEndpoint = 'https://newaccount.telos.eostribe.io/create';


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

  const addTelosAccount = (json, account, fioAccount) => {
    if (json && json.transaction_id) {
      connectAccount(account);
      // Connect Telos account to a FIO address:
      fioAddPublicAddress(fioAccount, account, fioFee);
      goBack();
    } else {
      log({
        description: 'Failed to add account: ' + account.accountName,
        cause: json,
        location: 'CreateTelosAccountScreen'
      });
      setCheckState('Failed to register account: ' + account.accountName);
    }
  };

  const createRandomTelosAccount = async (fioAccount) => {
    const accountName = randomName();
    ecc.randomKey().then(privateKey => {
      const publicKey = ecc.privateToPublic(privateKey);
      const account = { accountName, privateKey, chainName: 'Telos' };
      const request = {
        name: accountName,
        owner_public_key: publicKey,
        active_public_key: publicKey
      };
      // Call new account service:
      fetch(newAccountEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'API-KEY': 'TZEqLNkDP3b2sB7mNBmTfSVSr5FRDNqzAtpWY87gct7wnDvufk0eD1bRU5SH8aSs',
        },
        body: JSON.stringify(request),
      })
        .then(response => response.json())
        .then(json => addTelosAccount(json, account, fioAccount))
        .catch(error => log({
          description: '_handleCreateAccount - fetch ' + newAccountEndpoint + ' POST: [' + accountName + ']',
          cause: error,
          location: 'CreateTelosAccountScreen'
        })
      );
    });
  };

  const connectFioAccount = (json, fioAccount) => {
    setLoading(false);
    if(json.success) {
      connectAccount(fioAccount);
      log({
        description: 'New FIO address registration',
        address: fioAccount.address,
        transaction: json.account_id,
        location: 'RegisterAddressScreen'
      });
      Alert.alert('Registered '+fioAccount.address+' address. Please backup your account private keys!');
      createRandomTelosAccount(fioAccount);
      //goBack();
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
    });
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
