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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KHeader, KText, KButton } from '../../components';
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

  const setAccountStats = (json) => {
    setAccountBalance(parseFloat(json.amount)/1000000);
    setRewards(parseFloat(json.rewards)/1000000);
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
    deleteAccount(index);
    goBack();
  };

  const _handleBackupKey = () => {
    navigate('PrivateKeyBackup', { account });
  };

  loadAlgoAccountBalance(account);

  return (
    <SafeAreaView style={styles.container}>
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
        <KText>Account status: {accountStatus}</KText>
        <KText>Full address: {account.account.addr}</KText>
        <View style={styles.spacer} />
        <View style={styles.qrcode}>
          <QRCode value={account.account.addr} size={250}/>
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
    </SafeAreaView>
  );
};

export default connectAccounts()(AlgoAccountScreen);
