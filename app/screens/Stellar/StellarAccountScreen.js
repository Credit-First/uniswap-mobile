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
import styles from './StellarAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { getEndpoint } from '../../eos/chains';
import { loadAccount } from '../../stellar/stellar';
import { log } from '../../logger/logger';


const StellarAccountScreen = props => {
  const [accountBalance, setAccountBalance] = useState();
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
    accountsState: { accounts, addresses, keys, totals, config },
  } = props;

  const divider = 1000000;
  const fioEndpoint = getEndpoint('FIO');
  // var runOnce = 0;
  const name =  "XLM:" + account.address;
  var usdValue = 0;
  for (const elem of totals) {
    if(elem.account===name) {
      usdValue = elem.total;
      break;
    }
  }

  const copyToClipboard = () => {
    Clipboard.setString(account.address);
    Alert.alert('Address copied to Clipboard');
  };

  const checkStellarAddress = (fioaccount, stellarAddress) => {
    if (loaded) {
      return;
    }
    if (stellarAddress === account.address) {
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
            chain_code: 'XLM',
            token_code: 'XLM',
          }),
        })
          .then(response => response.json())
          .then(json => checkStellarAddress(value, json.public_address))
          .catch(error =>
            log({
              description:
                'checkConnectedFIOAccounts - fetch ' +
                fioEndpoint +
                '/v1/chain/get_pub_address',
              cause: error,
              location: 'StellarAccountScreen',
            }),
          );
      }
    });
  };

  const setAccountStats = json => {
    console.log(json);
    var nativeBalance = 0;
    if(json['status'] && json['status'] === 404) {
      setAccountStatus('Account not initialized! \nDeposit 1 XLM into this address to initialize account on ledger.');
    }
    if(json['balances']) {
      const balances = json['balances'];
      balances.forEach(balance => {
        if(balance["asset_type"] === "native") {
          nativeBalance = balance["balance"];
        }
      });
      setAccountStatus('Live account on ledger.');
    }
    setAccountBalance(parseFloat(nativeBalance).toFixed(4));
    checkConnectedFIOAccounts();
  };

  const loadStellarAccountBalance = async account => {
    if (loaded) {
      return;
    }
    try {
      loadAccount(account.address, setAccountStats) // 'GAI3GJ2Q3B35AOZJ36C4ANE3HSS4NK7WI6DNO4ZSHRAX6NG7BMX6VJER'
    } catch (err) {
      log({
        description: 'loadStellarAccountBalance',
        cause: err,
        location: 'StellarAccountScreen',
      });
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
        el.address === account.address &&
        el.chainName === account.chainName,
    );
    Alert.alert(
      'Delete Stellar Account',
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

  const getTitle = () => {
    return 'Stellar: ' + account.address.substring(0,12) + '...';
  }

  loadStellarAccountBalance(account);

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
        <KHeader title={getTitle()} style={styles.header} />
        <KText>Balance: {accountBalance} XLM</KText>
        <KText>USD Value: ${usdValue}</KText>
        <KText>Status: {accountStatus}</KText>
        <View style={styles.spacer} />
        <Text style={styles.link} onPress={copyToClipboard}>
          {account.address}
        </Text>
        <View style={styles.qrcode}>
          <QRCode value={account.address} size={200} />
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

export default connectAccounts()(StellarAccountScreen);
