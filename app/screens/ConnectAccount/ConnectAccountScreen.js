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
import { KHeader, KButton, KInput, KSelect } from '../../components';
import { supportedChains } from '../../eos/chains';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { getAccount } from '../../eos/eos';


const ConnectAccountScreen = props => {
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const [accountName, setAccountName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [chain, setChain] = useState(null);
  const [accountNamePlaceholder, setAccountNamePlaceholder] = useState('');
  const [isFioChain, setIsFioChain] = useState(false);


  const _handleConnect = async () => {
    if (!accountName || !privateKey || !chain) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      await getAccount(accountName, chain);
    } catch (e) {
      Alert.alert('Please input valid account name');
      return;
    }

    if (!ecc.isValidPrivate(privateKey)) {
      Alert.alert('Please input valid private key');
      return;
    }

    connectAccount({ accountName, privateKey, chainName: chain.name });
    goBack();
  };

  const _handleOnChainChange = (value) => {
    if(value.chainName==='FIO') {
      setAccountNamePlaceholder('Not required for FIO import');
      setIsFioChain(true);
    } else {
      setAccountNamePlaceholder('Enter your account name');
      setIsFioChain(false);
    }
    setChain(value);
  }

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
            onValueChange={_handleOnChainChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Account name'}
            placeholder={accountNamePlaceholder}
            value={accountName}
            onChangeText={setAccountName}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={!isFioChain}
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
