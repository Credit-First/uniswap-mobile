import React, { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KHeader, KText, KInput, KButton } from '../../components';
import styles from './AlgoAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import algosdk from 'algosdk';

const AlgoAccountScreen = props => {
  const [accountBalance, setAccountBalance] = useState();
  const [rewards, setRewards] = useState();
  const [accountStatus, setAccountStatus] = useState();

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    deleteAccount,
    accountsState: { accounts },
  } = props;

  const divider = 1000000;

  const setAccountStats = (json) => {
    setAccountBalance(parseFloat(json.amount)/divider);
    setRewards(parseFloat(json.rewards)/divider);
    setAccountStatus(json.status);
  };

  const loadAlgoAccountBalance = async (account) => {
    try {
      const addr = account.account.addr;
      fetch('https://algo.eostribe.io/v1/account/'+addr, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => setAccountStats(json))
        .catch(error => console.log(error));
    } catch (e) {
      console.log('Error: ' + e);
      return;
    }
  };

  const _handleRemoveAccount = () => {
    const index = findIndex(
      accounts,
      el =>
        el.accountName === account.accountName &&
        el.chainName === account.chainName,
    );
    Alert.alert(
      'Delete Algorand Account',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete account cancelled'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => deleteAccount(index) }
      ],
      { cancelable: false }
    );
    goBack();
  };

  const _handleBackupKey = () => {
    navigate('PrivateKeyBackup', { account });
  };

  loadAlgoAccountBalance(account);

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
        <KHeader title={account.accountName} style={styles.header} />
        <KText>Balance: {accountBalance} ALGO</KText>
        <KText>Rewards: {rewards} ALGO</KText>
        <KInput
          label={'Account address'}
          value={account.account.addr}
          containerStyle={styles.inputContainer}
          multiline={true}
          editable={false}
        />
        <View style={styles.spacer} />
        <View style={styles.qrcode}>
          <QRCode value={account.account.addr} size={200}/>
        </View>
        <View style={styles.spacer} />
        <KButton
            title={'Backup private key'}
            theme={'primary'}
            style={styles.button}
            onPress={_handleBackupKey}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
            )}
          />
          <KButton
            title={'Remove this account'}
            theme={'brown'}
            style={styles.button}
            icon={'remove'}
            onPress={_handleRemoveAccount}
          />
      </View>
     </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(AlgoAccountScreen);
