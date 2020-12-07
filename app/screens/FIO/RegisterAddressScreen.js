import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Text,
  Linking } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ecc from 'eosjs-ecc-rn';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioBackupEncryptedKey } from '../../eos/fio';
import styles from './RegisterAddress.style';
import { KHeader,
  KInput,
  KText,
  KButton,
  InputAddress,
  EmailCodeSend } from '../../components';
import { PRIMARY_BLUE } from '../../theme/colors';
import { getEndpoint } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';


const chars = '12345abcdefghijklmnopqrstuvwxyz';

function randomName() {
    var result = '';
    for (var i = 12; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

const RegisterAddressScreen = props => {
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState('');
  const [fioAccount, setFioAccount] = useState();
  const [fioFee, setFioFee] = useState(0);
  const [registeredAddresses, setRegisteredAddresses] = useState();
  const {
    addKey,
    connectAccount,
    navigation: { navigate, goBack },
    accountsState: { accounts, activeAccountIndex, addresses, keys },
  } = props;
  // FIO endpoint:
  const fioEndpoint = getEndpoint('FIO');
  const fioRegistrationUrl = 'https://fioregistration.eostribe.io/fioreg';
  // Telos endpoint:
  const endpoint = getEndpoint('Telos');
  const newAccountEndpoint = 'https://newaccount.telos.eostribe.io/create';
  // Check device registrations endpint:
  const deviceId = DeviceInfo.getUniqueId();
  const checkDeviceEndpoint = 'https://wallet.eostribe.io/getfiobyuid?uid='+deviceId;

  var sha256 = require('js-sha256');
  var date = new Date();
  var currentUTCDate = date.getUTCDate() + '-' + date.getUTCMonth()  + '-' + date.getUTCFullYear();


  const _sendEmailCode = (email) => {
    let request = {
      "email": email,
      "device_id": deviceId
    };
    fetch(fioRegistrationUrl + "/send_code", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then(response => response.text())
      .then(text => processEmailCodeResponse(text))
      .catch(error => reportError(error));
  };

  const processEmailCodeResponse = (text) => {
    try {
      let json = JSON.parse(text);
      if(json.message) {
        Alert.alert(json.message);
      } else {
        Alert.alert(text);
      }
    } catch (err) {
      Alert.alert(text);
    }
  };

  const processRegisteredAddresses = (response) => {
    if(response.status !== 200) {
      return;
    }
    let json = response.json();
    if (json.fioAccounts) {
      setRegisteredAddresses(json.fioAccounts)
    } else if(json.length > 0) {
      setRegisteredAddresses(json);
    } else {
      setRegisteredAddresses([]);
    }
  };

  if(!registeredAddresses) {
    try {
      fetch(checkDeviceEndpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => processRegisteredAddresses(response))
      .catch(error => log({ description: 'Check device by id call error',
        cause: error,
        location: 'RegisterAddressScreen'})
      );
    } catch (err) {
      log({ description: 'Check device by id call error',
        cause: err,
        location: 'RegisterAddressScreen'});
    }
  }

  const _checkAvailable = async name => {
    if (name.indexOf('@') > 0) {
      name = name.replace('@','');
    }
    if(name.indexOf(' ') > 0) {
      name = name.replace(' ','');
    }
    if(name.indexOf('.') > 0) {
      name = name.replace('.','');
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
      log({ description: 'updateAvailableState',
        cause: error,
        response: json,
        address: newAddress,
        location: 'RegisterAddressScreen'});
    }
  };

const connectFioAccount = (text, fioAccount) => {
  setLoading(false);
  try {
    let json = JSON.parse(text);
    if(json.success) {
      connectAccount(fioAccount);
      log({
        description: 'New FIO address registration',
        address: fioAccount.address,
        transaction: json.account_id,
	      response: text,
        location: 'RegisterAddressScreen'
      });
      Alert.alert('Registered '+fioAccount.address+' address!');
    } else {
      json.method = 'connectFioAccount';
      json.address = fioAccount.address;
      reportError(json);
      Alert.alert('Error: '+text);
    }
  } catch(err) {
    log({
      description: 'New FIO address registration error',
      address: fioAccount.address,
      response: text,
      cause: err,
      location: 'RegisterAddressScreen'
    });
    Alert.alert('Error: '+text);
  } finally {
    fioBackupEncryptedKey(fioAccount, null, fioAccount.chainName, fioAccount.privateKey);
  }
};

  const reportError = (error, request) => {
    setLoading(false);
    Alert.alert('Register FIO service call error '+error.error);
    log({
      description: 'Register FIO service call error',
      cause: error,
      request: request,
      location: 'RegisterAddressScreen'
    });
  };

  const _nextRegister = async () => {
    setLoading(true);
    ecc.randomKey().then(privateKey => {
      const fioPubkey = Ecc.privateToPublic(privateKey);
      addKey({ private: privateKey, public: fioPubkey });
      const fioAccount = { address, privateKey, chainName: 'FIO' };
      var hash = sha256(email+code+deviceId+address+fioPubkey+currentUTCDate);
      const request = {
        "email":email,
        "code":code,
        "device_id":deviceId,
        "fio_address":address,
        "public_key":fioPubkey,
        "hash": hash
      };
      fetch(fioRegistrationUrl+'/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
        .then(response => response.text())
        .then(text => connectFioAccount(text, fioAccount))
        .catch(error => log({
          description: 'Register FIO service call error',
          cause: error,
          request: request,
          response: text,
          location: 'RegisterAddressScreen'
        })
      );
    });
  };


  if (registeredAddresses && registeredAddresses.length > 0) {
    return (
     <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
          <KHeader
            title={'Already registered'}
            subTitle={'This device already registered addresses:'}
            style={styles.header}
          />
          <View style={styles.spacer} />
          <FlatList
            data={registeredAddresses}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => (
              <Text>{item}</Text>
            )}
          />
          <View style={styles.spacer} />
          <Text>You can re-import them using backed up private key:</Text>
          <KButton
            title={'Import accounts'}
            theme={'blue'}
            style={styles.button}
            onPress={() => navigate('ConnectAccount')}
            renderIcon={() => (
              <Image
                source={require('../../../assets/icons/accounts.png')}
                style={styles.buttonIcon}
              />
            )}
          />
      </SafeAreaView>
    );
  } else if(email && code && code.length == 6) {
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
            title={'Register FIO address'}
            subTitle={'Register new FIO address under @tribe domain'}
            style={styles.header}
          />
          <KText>Email: {email}</KText>
          <KInput
            placeholder={'Enter code from email'}
            value={code}
            onChangeText={setCode}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <InputAddress onChange={_checkAvailable}/>
          <KText>{checkState}</KText>
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
            title={'Register FIO address'}
            subTitle={'Request registration code on email first'}
            style={styles.header}
          />
          <EmailCodeSend onChange={setEmail} onSendCode={_sendEmailCode}/>
          <KInput
            placeholder={'Enter code from email'}
            value={code}
            onChangeText={setCode}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
        </View>
      </KeyboardAwareScrollView>
     </SafeAreaView>
    );
  }


};

export default connectAccounts()(RegisterAddressScreen);
