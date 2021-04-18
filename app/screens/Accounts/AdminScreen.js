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
import styles from './Admin.style';
import { KHeader, KButton, KInput, KText } from '../../components';
import { loadAccountSecret } from '../../eos/fio';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { getEndpoint } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import KeyItem from './components/KeyItem';
import { getAccount } from '../../eos/eos';
import { log } from '../../logger/logger';

const AdminScreen = props => {
  const {
    connectAccount,
    navigation: { goBack },
    accountsState: { accounts, addresses, keys, config },
  } = props;

  const [accountName, setAccountName] = useState('');
  const [privateKey, setPrivateKey] = useState();
  const [publicKey, setPublicKey] = useState();
  const [chainName, setChainName] = useState();
  const [error, setError] = useState();

  const adminAccount = accounts.filter((value, index, array) => {
    return value.chainName === 'FIO' && value.address === 'admin@tribe';
  });

  const processSecret = json => {
    if (json) {
      let key = json.memo;
      setPrivateKey(key);
      let chain = json.chain_code;
      setChainName(chain);
      if (chain == 'FIO') {
        let publicKey = Ecc.privateToPublic(key);
        setPublicKey(publicKey);
      } else {
        let publicKey = ecc.privateToPublic(key);
        setPublicKey(publicKey);
      }
    } else {
      setError('No response:' + json);
    }
  };

  const _handleLoadAccountKey = () => {
    if (adminAccount.length > 0) {
      loadAccountSecret(adminAccount[0], accountName, processSecret);
    }
  };

  if (adminAccount.length > 0) {
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
            <KHeader title={'Admin: Load account'} style={styles.header} />
            <KInput
              label={'Account name'}
              value={accountName}
              placeholder={'Enter account name'}
              onChangeText={setAccountName}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <View style={styles.spacer} />
            <KText>{chainName}</KText>
            <View style={styles.spacer} />
            <KeyItem
              publicKey={publicKey}
              privateKey={privateKey}
              style={styles.listItem}
            />
            <KText style={styles.error}>{error}</KText>
            <View style={styles.spacer} />
            <KButton
              title={'Load keys'}
              theme={'brown'}
              style={styles.button}
              onPress={_handleLoadAccountKey}
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
          <View style={styles.content}>
            <KHeader title={'No Admin account'} style={styles.header} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(AdminScreen);
