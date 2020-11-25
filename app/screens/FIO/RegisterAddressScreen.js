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
    connectAccount,
    navigation: { navigate, goBack },
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

  const _sendEmailCode = (email) => {
    fetch(fioRegistrationUrl + "/send_code", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "device_id": deviceId
      }),
    })
      .then(response => response.json())
      .then(json => Alert.alert(json))
      .catch(error => reportError(error));
  };

  const processRegisteredAddresses = (json) => {
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
      .then(response => response.json())
      .then(json => processRegisteredAddresses(json))
      .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }

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
    } else {
      json.method = 'connectFioAccount';
      json.address = fioAccount.address;
      reportError(json);
    }
  };

  const reportError = (error) => {
    setLoading(false);
    Alert.alert('Register FIO service call error '+error.error);
    log({
      description: 'Register FIO service call error',
      cause: error,
      location: 'RegisterAddressScreen'
    });
  };

  const _nextRegister = async () => {
    setLoading(true);
    ecc.randomKey().then(privateKey => {
      const fioPubkey = Ecc.privateToPublic(privateKey);
      const fioAccount = { address, privateKey, chainName: 'FIO' };
      fetch(fioRegistrationUrl+'/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email":email,
          "code":code,
          "device_id":deviceId,
          "fio_address":address,
          "public_key":fioPubkey
        }),
      })
        .then(response => response.json())
        .then(json => connectFioAccount(json, fioAccount))
        .catch(error => reportError(error));
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
  } else if(code && code.length == 6) {
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
