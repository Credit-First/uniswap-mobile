import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './ConnectAccountScreen.style';
import { KHeader, KButton, KInput, KSelect } from '../../components';
import { supportedChains } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { getAccount } from '../../eos/eos';
import { log } from '../../logger/logger';


const ConnectAccountScreen = props => {
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const [accountName, setAccountName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [chain, setChain] = useState(null);
  const [isFioChain, setIsFioChain] = useState(false);

  const connectFioAccount = fioAddresses => {
    if (fioAddresses) {
      fioAddresses.map(function(item) {
        let address = item.fio_address;
        connectAccount({ address: address, privateKey: privateKey, chainName: 'FIO' });
      });
    }
  }

  const _handleConnect = async () => {
    if (!chain || !privateKey) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    if (chain.name !== 'FIO') {
      try {
        await getAccount(accountName, chain);
      } catch (e) {
        Alert.alert('Please input valid account name');
        return;
      }
    }

    if (!ecc.isValidPrivate(privateKey)) {
      Alert.alert('Please input valid private key');
      return;
    }

    if(chain.name==='FIO') {
      const fioPublicKey = Ecc.privateToPublic(privateKey);
      fetch('http://fio.eostribe.io/v1/chain/get_fio_names', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fio_public_key: fioPublicKey,
          }),
        })
        .then(response => response.json())
        .then(json => connectFioAccount(json.fio_addresses))
        .catch(error => log({
          description: '_handleConnect - fetch http://fio.eostribe.io/v1/chain/get_fio_names',
          cause: error,
          location: 'ConnectAccountScreen'
        })
      );
    } else {
      connectAccount({ accountName, privateKey, chainName: chain.name });
    }
    goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.content}>
          <KHeader
            title={'Account'}
            subTitle={'Connect your account'}
            style={styles.header}
          />
          <KSelect
            label={'Blockchain'}
            items={supportedChains.map(item => ({
              label: item.name,
              value: item,
            }))}
            onValueChange={setChain}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Account name'}
            placeholder={'Enter account name (optional for FIO import)'}
            value={accountName}
            onChangeText={setAccountName}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KInput
            label={'Private Key'}
            placeholder={'Enter your private key'}
            secureTextEntry
            value={privateKey}
            onChangeText={setPrivateKey}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <KButton
            title={'Connect account'}
            theme={'blue'}
            style={styles.button}
            renderIcon={() => (
              <Image
                source={require('../../../assets/icons/accounts.png')}
                style={styles.buttonIcon}
              />
            )}
            onPress={_handleConnect}
          />
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(ConnectAccountScreen);
