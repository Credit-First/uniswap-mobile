import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
  Text,
  Image,
  SafeAreaView,
  View,
  TouchableOpacity,
  Clipboard,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const BackupAllKeysScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  var privateKeys = '';
  accounts.map((value, index, array) => {
    var chainName = value.chainName == 'Telos' ? 'TLOS' : value.chainName;
    var accountName = (value.address) ? value.address : value.accountName;
    var privateKey = chainName === 'ALGO' ? value.mnemonic : value.privateKey;
    privateKeys += chainName + ':' + accountName + ':' + privateKey + ',';
  });

  const copyToClipboard = () => {
    Clipboard.setString(privateKeys);
    Alert.alert('Private keys copied to Clipboard');
  };

  if (accounts.length === 0) {
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
              title={'Backup keys not available'}
              subTitle={'No accounts in wallet'}
              style={styles.header}
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
          <KHeader title={'Backup all private keys'} style={styles.header} />
          <View style={styles.qrcode}>
            <QRCode value={privateKeys} size={200} />
          </View>
          <View style={styles.spacer} />
          <KButton
            title={'Copy to Clipboard'}
            theme={'brown'}
            style={styles.button}
            onPress={copyToClipboard}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

};

export default connectAccounts()(BackupAllKeysScreen);
