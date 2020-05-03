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
import { KHeader, KButton, KText } from '../../components';
import KInput from '../../components/KInput';
import supportedChains from '../../eos/chains';
import { getAccount } from '../../eos/eos';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const ChainItem = ({ data, onPress, selected }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chainItem, selected && styles.chainItemSelected]}>
        <Image style={styles.chainItemImage} source={data.icon} />
        <KText>{data.name}</KText>
      </View>
    </TouchableOpacity>
  );
};

const ConnectAccountScreen = props => {
  const {
    connectAccount,
    navigation: { goBack },
  } = props;

  const [accountName, setAccountName] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const [chainIndex, setChainIndex] = useState(0);

  const _handleConnect = async () => {
    const chain = supportedChains[chainIndex];
    try {
      const account = await getAccount(accountName, chain);
      console.log('account: ', account);
    } catch (e) {
      console.log(e);
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
          <KText style={styles.chainLabel}>Blockchain</KText>
          <View style={styles.chainItemsContainer}>
            {supportedChains.map((item, index) => (
              <ChainItem
                data={item}
                key={`${index}`}
                selected={index === chainIndex}
                onPress={() => setChainIndex(index)}
              />
            ))}
          </View>
          <KInput
            label={'Account name'}
            placeholder={'Enter your account name'}
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
