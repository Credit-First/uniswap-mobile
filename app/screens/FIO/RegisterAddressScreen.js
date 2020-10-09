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
  const [registeredAddresses, setRegisteredAddresses] = useState();
  const {
    connectAccount,
    navigation: { navigate, goBack },
  } = props;
  // FIO endpoint:
  const fioEndpoint = getEndpoint('FIO');
  const apiToken = 'YCDPh0ni7MMwrAXa1eerq3JBBFWHDjgd6RbflXVAg653Zh0';
  // Telos endpoint:
  const endpoint = getEndpoint('Telos');
  const newAccountEndpoint = 'https://newaccount.telos.eostribe.io/create';
  // Check device registrations endpint:
  const checkDeviceEndpoint = 'https://wallet.eostribe.io/getfiobyuid?uid='+DeviceInfo.getUniqueId();

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

  if (registeredAddresses && registeredAddresses.length > 1) {
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
  } else if (registeredAddresses && registeredAddresses.length == 1) {
    let registeredAddress = registeredAddresses[0];
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
          <KText>{checkState}</KText>
          <KButton
            title={'Register address'}
            theme={'blue'}
            style={styles.button}
            icon={'check'}
            onPress={_nextRegister}
            isLoading={loading}
          />
          <KText style={styles.validation}>Our records indicate one address already registered "{registeredAddress}" on this device.</KText>
          <KText style={styles.validation}>We will allow only one more address registration.</KText>
          <KText style={styles.validation}>Please backup your new address private keys.</KText>
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
            title={'Register new address'}
            subTitle={'Register new FIO address under @tribe domain'}
            style={styles.header}
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
  }


};

export default connectAccounts()(RegisterAddressScreen);
