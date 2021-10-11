import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Alert,
  Text,
  Clipboard,
  TouchableOpacity,
} from 'react-native';
import ecc from 'eosjs-ecc-rn';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { KHeader, KButton, KInput, KText } from '../../components';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import CryptoJS from 'react-native-crypto-js';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const RecoverPrivateKeyScreen = props => {
  const {
    connectAccount,
    navigation: { goBack }
  } = props;

  const [part1, setPart1] = useState();
  const [part2, setPart2] = useState();
  const [password, setPassword] = useState();
  const [privateKey, setPrivateKey] = useState();
  const [error, setError] = useState();

  const _handleDecryptPrivateKey = () => {
    setPrivateKey('');
    setError('');
    if (part1 && part2 && password) {
      try {
        let whole12 = part1 + part2;
        let pkey12 = CryptoJS.AES.decrypt(whole12, password).toString(CryptoJS.enc.Utf8);
        if(pkey12) {
          setPrivateKey(pkey12);
        } else {
          let whole21 = part2 + part1;
          let pkey21 = CryptoJS.AES.decrypt(whole21, password).toString(CryptoJS.enc.Utf8);
          if(pkey21) {
            setPrivateKey(pkey21);
          } else {
            setError("Failed to decrypt or wrong password.");
          }
        }
      } catch(err) {
          log({
            description: 'Error decrypting private key',
            cause: err,
            location: 'RecoverPrivateKeyScreen',
          });
        }
    } else {
      setError("Please fill all required fields");
    }
  };

  const _copyPrivateKeyToClipboard = () => {
      Clipboard.setString(privateKey);
      Alert.alert('Private Key copied to Clipboard!');
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
            <KHeader title={'Recover Delegated Private Key'} style={styles.header} />
            <KInput
              label={'Part 1'}
              value={part1}
              placeholder={'Enter part 1 secret you received from admin'}
              secureTextEntry
              onChangeText={setPart1}
              onPasteHandler={setPart1}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <KInput
              label={'Part 2'}
              value={part2}
              placeholder={'Enter part 2 secret you received from admin'}
              secureTextEntry
              onChangeText={setPart2}
              onPasteHandler={setPart2}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <KInput
              label={'Password'}
              value={password}
              placeholder={'Enter password you used to encrypt your private key'}
              secureTextEntry
              onChangeText={setPassword}
              onPasteHandler={setPassword}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
            />
            <View style={styles.spacer} />
            <Text>Private Key:</Text>
            <Text style={styles.link} onPress={_copyPrivateKeyToClipboard}>{privateKey}</Text>
            <KText style={styles.error}>{error}</KText>
            <View style={styles.spacer} />
            <KButton
              title={'Decrypt Private Key'}
              theme={'brown'}
              style={styles.button}
              onPress={_handleDecryptPrivateKey}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
  );

};

export default connectAccounts()(RecoverPrivateKeyScreen);
