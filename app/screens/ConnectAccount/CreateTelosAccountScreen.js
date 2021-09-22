import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ecc from 'eosjs-ecc-rn';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './ConnectAccountScreen.style';
import { KHeader, KButton, KInput, KText } from '../../components';
import { fioAddPublicAddress, fioBackupEncryptedKey } from '../../eos/fio';
import { getEndpoint } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const chars = '12345abcdefghijklmnopqrstuvwxyz';

function randomName() {
  var result = '';
  for (var i = 12; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
}

const CreateTelosAccountScreen = props => {
  const {
    addKey,
    connectAccount,
    navigation: { goBack },
    accountsState: { accounts },
  } = props;

  const [accountName, setAccountName] = useState('');
  const [available, setAvailable] = useState(false);
  const [checkState, setCheckState] = useState();
  const [availableState, setAvailableState] = useState(
    'Use generated random name or enter your own.',
  );
  const [fioFee, setFioFee] = useState(0);

  const fioEndpoint = getEndpoint('FIO');
  const endpoint = getEndpoint('Telos');
  const newAccountEndpoint = 'https://newaccount.telos.eostribe.io/create';

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
          description: 'getFee - fetch ' + fioEndpoint + '/v1/chain/get_fee',
          cause: error,
          location: 'CreateTelosAccountScreen',
        }),
      );
  };

  const fioAccounts = accounts.filter((value, index, array) => {
    if (value.chainName === 'FIO' && fioFee === 0) {
      getFee(value.address);
    }
    return value.chainName === 'FIO';
  });

  const validateName = name => {
    setAccountName(name);
    var validName = '';
    for (var i = 0; i < name.length; i++) {
      let ch = name.charAt(i);
      if (chars.indexOf(ch) >= 0 && i < 12) {
        validName += ch;
      }
    }
    setAccountName(validName);
    if (validName.length !== 12) {
      setCheckState('Name must be 12 chars long [a-z,1-5]');
      setAvailable(false);
      setAvailableState('');
    } else {
      setCheckState('');
      checkAvailable(validName);
    }
  };

  const markAvailable = json => {
    if (json && json.account_name) {
      setAvailable(false);
      setCheckState('Name already registered!');
      setAvailableState('');
    } else {
      setAvailable(true);
      setCheckState('');
      setAvailableState('Name available');
    }
  };

  const checkAvailable = name => {
    fetch(endpoint + '/v1/chain/get_account', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_name: name,
      }),
    })
      .then(response => response.json())
      .then(json => markAvailable(json))
      .catch(error =>
        log({
          description:
            'checkAvailable - fetch ' +
            endpoint +
            '/v1/chain/get_account [' +
            name +
            ']',
          cause: error,
          location: 'CreateTelosAccountScreen',
        }),
      );
  };

  const generateRandomName = () => {
    setAccountName(randomName());
    checkAvailable(accountName);
  };

  const addAccount = (json, account) => {
    if (json && json.transaction_id) {
      connectAccount(account);
      // Connect Telos account to a single FIO address:
      if (fioAccounts.length === 1) {
        fioAddPublicAddress(fioAccounts[0], account, fioFee);
        // Backup encrypted Telos account:
        fioBackupEncryptedKey(
          fioAccounts[0],
          account.accountName,
          account.chainName,
          account.privateKey,
        );
      }
      Alert.alert('Account registered on chain: ' + json.transaction_id);
      goBack();
    } else {
      log({
        description: 'Failed to add account: ' + account.accountName,
        cause: json,
        location: 'CreateTelosAccountScreen',
      });
      setCheckState('Failed to register account: ' + account.accountName);
    }
  };

  const _handleCreateAccount = async () => {
    ecc.randomKey().then(privateKey => {
      const publicKey = ecc.privateToPublic(privateKey);
      addKey({ private: privateKey, public: publicKey });
      const account = { accountName, privateKey, chainName: 'Telos' };
      const request = {
        name: accountName,
        owner_public_key: publicKey,
        active_public_key: publicKey,
      };
      // Call new account service:
      fetch(newAccountEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'API-KEY':
            'TZEqLNkDP3b2sB7mNBmTfSVSr5FRDNqzAtpWY87gct7wnDvufk0eD1bRU5SH8aSs',
        },
        body: JSON.stringify(request),
      })
        .then(response => response.json())
        .then(json => addAccount(json, account))
        .catch(error =>
          log({
            description:
              '_handleCreateAccount - fetch ' +
              newAccountEndpoint +
              ' POST: [' +
              accountName +
              ']',
            cause: error,
            location: 'CreateTelosAccountScreen',
          }),
        );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
          <KHeader title={'Create Telos account'} style={styles.header} />
          <KInput
            label={'Account name'}
            value={accountName}
            placeholder={'Enter 12 chars name [a-z,1-5] or generate random.'}
            onChangeText={validateName}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KText style={styles.error}>{checkState}</KText>
          <KText style={styles.message}>{availableState}</KText>
          <View style={styles.spacer} />
          <KButton
            title={'Generate random'}
            theme={'brown'}
            style={styles.button}
            onPress={generateRandomName}
          />
          <KButton
            title={'Create account'}
            theme={'blue'}
            style={styles.button}
            isLoading={!available}
            renderIcon={() => (
              <Image
                source={require('../../../assets/icons/accounts.png')}
                style={styles.buttonIcon}
              />
            )}
            onPress={_handleCreateAccount}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(CreateTelosAccountScreen);
