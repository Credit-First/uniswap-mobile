import React, { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Clipboard,
  Image,
  Text,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KHeader, KText, KButton } from '../../components';
import styles from './AlgoAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { getEndpoint } from '../../eos/chains';
import { log } from '../../logger/logger';

const AlgoAccountScreen = props => {
  const [accountBalance, setAccountBalance] = useState();
  const [rewards, setRewards] = useState();
  const [accountStatus, setAccountStatus] = useState();
  const [connectedHeader, setConnectedHeader] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [loaded, setLoaded] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    deleteAccount,
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const divider = 1000000;
  const fioEndpoint = getEndpoint('FIO');
  // var runOnce = 0;
  const name =  "ALGO:" + account.accountName;
  var usdValue = 0;
  for (const elem of totals) {
    if(elem.account===name) {
      usdValue = elem.total;
      break;
    }
  }

  const copyToClipboard = () => {
    Clipboard.setString(account.account.addr);
    Alert.alert('Address copied to Clipboard');
  };

  const checkAlgoAddress = (fioaccount, algoAddress) => {
    if (loaded) {
      return;
    }
    if (algoAddress === account.account.addr) {
      if (connectedHeader === '') {
        setConnectedHeader('Connected to FIO address:');
      }
      if (connectedAddress === '') {
        setConnectedAddress(fioaccount.address);
      }
    }
  };

  const checkConnectedFIOAccounts = async () => {
    if (loaded) {
      return;
    }
    // Check if connected to any local FIO address:
    accounts.map((value, index, self) => {
      if (value.chainName === 'FIO' && value.address) {
        setLoaded(true);
        fetch(fioEndpoint + '/v1/chain/get_pub_address', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fio_address: value.address,
            chain_code: 'ALGO',
            token_code: 'ALGO',
          }),
        })
          .then(response => response.json())
          .then(json => checkAlgoAddress(value, json.public_address))
          .catch(error =>
            log({
              description:
                'checkConnectedFIOAccounts - fetch ' +
                fioEndpoint +
                '/v1/chain/get_pub_address',
              cause: error,
              location: 'AlgoAccountScreen',
            }),
          );
      }
    });
  };

  const setAccountStats = json => {
    setAccountBalance(parseFloat(json.amount) / divider);
    setRewards(parseFloat(json.rewards) / divider);
    setAccountStatus(json.status);
    checkConnectedFIOAccounts();
  };

  const loadAlgoAccountBalance = async account => {
    if (loaded) {
      return;
    }
    try {
      const addr = account.account.addr;
      fetch('http://algo.eostribe.io/v1/account/' + addr, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => setAccountStats(json))
        .catch(error =>
          log({
            description:
              'loadAlgoAccountBalance - fetch https://algo.eostribe.io/v1/account/' +
              addr,
            cause: error,
            location: 'AlgoAccountScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'loadAlgoAccountBalance',
        cause: err,
        location: 'AlgoAccountScreen',
      });
      return;
    }
  };

  const _handleDeleteAccount = index => {
    deleteAccount(index);
    goBack();
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
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _handleDeleteAccount(index) },
      ],
      { cancelable: false },
    );
  };

  const _handleBackupKey = () => {
    navigate('PrivateKeyBackup', { account });
  };

  const _handlePressAccount = index => {
    const fioAccount = connectedAccounts[index];
    navigate('FIOAddressActions', { fioAccount });
  };

  const _handleTransfer = () => {
    navigate('Transfer', { account });
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
        <KText>USD Value: ${usdValue}</KText>
        <KText>Rewards: {rewards} ALGO</KText>
        <Text style={styles.link} onPress={copyToClipboard}>
          {account.account.addr}
        </Text>
        <View style={styles.qrcode}>
          <QRCode value={account.account.addr} size={200} />
        </View>
        <KText>{connectedHeader}</KText>
        <KText>{connectedAddress}</KText>
        <FlatList />
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
