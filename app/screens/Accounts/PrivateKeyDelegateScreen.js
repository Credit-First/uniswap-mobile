import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KSelect, KButton, KText } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioDelegateSecretRequest } from '../../eos/fio';
import CryptoJS from 'react-native-crypto-js';
import algosdk from 'algosdk';
import { log } from '../../logger/logger';

const PrivateKeyDelegateScreen = props => {
  const {
    navigation: { goBack },
    route: {
      params: { account },
    },
    accountsState: { accounts, addresses, keys, config },
  } = props;

  const [fromAccount, setFromAccount] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [guardian1, setGuardian1] = useState('admin@tribe');
  const [guardian1Pubkey, setGuardian1Pubkey] = useState(
    'FIO5ESppRYY3WVounFLTP9j3an5CwhSTxaJScKoeCNZ5PQHsyKYe5',
  );
  const [guardian2, setGuardian2] = useState('lostkeys@tribe');
  const [guardian2Pubkey, setGuardian2Pubkey] = useState(
    'FIO8mHmb3E7Rni7PUTrDKJMVWPdVP5yC31jUgSowERsJADwYysATB',
  );
  const [loading, setLoading] = useState(false);

  let privateKey = account.privateKey;
  if (account.chainName === 'ALGO') {
    let algoAccount = algosdk.mnemonicToSecretKey(account.mnemonic);
    privateKey = new Buffer(algoAccount.sk).toString('base64');
  }

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  const _handleGuardian1Change = address => {
    setGuardian1(address);
    fetch('http://fio.greymass.com/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_address: address,
        chain_code: 'FIO',
        token_code: 'FIO',
      }),
    })
      .then(response => response.json())
      .then(json => setGuardian1Pubkey(json.public_address))
      .catch(error =>
        log({
          description:
            '_handleGuardian1Change - fetch http://fio.greymass.com/v1/chain/get_pub_address',
          cause: error,
          location: 'PrivateKeyDelegateScreen',
        }),
      );
  };

  const _handleGuardian2Change = address => {
    setGuardian2(address);
    fetch('http://fio.greymass.com/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_address: address,
        chain_code: 'FIO',
        token_code: 'FIO',
      }),
    })
      .then(response => response.json())
      .then(json => setGuardian2Pubkey(json.public_address))
      .catch(error =>
        log({
          description:
            '_handleGuardian2Change - fetch http://fio.greymass.com/v1/chain/get_pub_address',
          cause: error,
          location: 'PrivateKeyDelegateScreen',
        }),
      );
  };

  const _delegateKey = async () => {
    if (!fromAccount || !email || !password || !guardian1 || !guardian2) {
      Alert.alert('Please fill all required fields on this form.');
      return;
    }
    if (!guardian1Pubkey) {
      Alert.alert('Unable to load guardian #1 FIO public key!');
      return;
    }
    if (!guardian2Pubkey) {
      Alert.alert('Unable to load guardian #2 FIO public key!');
      return;
    }
    let encryptedKey = CryptoJS.AES.encrypt(privateKey, password).toString();
    let splitIndex = parseInt(encryptedKey.length / 2);
    let firstHalf = encryptedKey.substring(0, splitIndex);
    let secondHalf = encryptedKey.substring(splitIndex, encryptedKey.length);
    try {
      setLoading(true);
      const res1 = await fioDelegateSecretRequest(
        fromAccount,
        guardian1,
        guardian1Pubkey,
        account.chainName,
        email,
        firstHalf,
        0,
      );
      if (res1 && res1.transaction_id) {
        const res2 = await fioDelegateSecretRequest(
          fromAccount,
          guardian2,
          guardian2Pubkey,
          account.chainName,
          email,
          secondHalf,
          0,
        );
        setLoading(false);
        if (res2 && res2.transaction_id) {
          Alert.alert('Private key encrypted, segmented and delegated!');
        } else {
          let error = {
            description: 'Failed _handleConnectAccountToAddress - segment 2',
            method: 'fioDelegateSecretRequest',
            location: 'PrivateKeyDelegateScreen',
            cause: res2,
            fromAccount: fromAccount.accountName,
            guardian2: guardian2,
            guardian2Pubkey: guardian2Pubkey,
            chainName: account.chainName,
            email: email,
          };
          log(error);
          Alert.alert('Failed to delegate key');
        }
      } else {
        setLoading(false);
        let error = {
          description: 'Failed _handleConnectAccountToAddress - segment 1',
          method: 'fioDelegateSecretRequest',
          location: 'PrivateKeyDelegateScreen',
          cause: res1,
          fromAccount: fromAccount.accountName,
          guardian1: guardian1,
          guardian1Pubkey: guardian1Pubkey,
          chainName: account.chainName,
          email: email,
        };
        log(error);
        Alert.alert('Failed to delegate key');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({
        description: '_delegateKey - fioDelegateSecretRequest',
        cause: err.message,
        location: 'PrivateKeyDelegateScreen',
      });
    }
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
            title={account.accountName}
            subTitle={account.chainName}
            style={styles.header}
          />
          <View style={styles.spacer} />
          <KSelect
            label={'Your FIO address'}
            placeholder={'Your originating FIO address for this request'}
            items={fioAccounts.map(item => ({
              label: `${item.chainName}: ${item.address}`,
              value: item,
            }))}
            onValueChange={setFromAccount}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Your email'}
            placeholder={'Enter your contact email to be used for recovery'}
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KInput
            label={'Password'}
            placeholder={'Enter encryption password you will remember'}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KInput
            label={'Guardian #1 (use default or enter your own)'}
            value={guardian1}
            onChangeText={_handleGuardian1Change}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KInput
            label={'Guardian #2 (use default or enter your own)'}
            value={guardian2}
            onChangeText={_handleGuardian2Change}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KButton
            title={'Delegate to guardians'}
            theme={'primary'}
            style={styles.button}
            onPress={_delegateKey}
            isLoading={loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(PrivateKeyDelegateScreen);
