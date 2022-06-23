import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-native-chart-kit';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Image,
  Text,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KHeader, KText, KButton, TwoIconsButtons } from '../../components';
import styles from './EthereumAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import web3Module from '../../ethereum/ethereum';
import Wallet from 'ethereumjs-wallet';
import { log } from '../../logger/logger';

const ethMultiplier = 1000000000000000000;
const tokenABI = require('../../ethereum/abi.json');
const tokenAddress = "";
const {
  getBalanceOfAccount
} = web3Module({
  tokenABI,
  tokenAddress,
  decimals: 18
});

const AuroraAccountScreen = props => {
  const [accountBalance, setAccountBalance] = useState();
  const [loaded, setLoaded] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    deleteAccount,
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [usdValue, setUsdValue] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [rewardsBalance, setRewardsBalance] = useState(0);

  // Stake chart data:
  const stakeData = [
    {
      name: 'Available',
      balance: parseFloat(availableBalance),
      color: 'rgba(42, 254, 106, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Staked',
      balance: parseFloat(stakedBalance),
      color: 'rgba(254, 142, 42, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Locked',
      balance: parseFloat(lockedBalance),
      color: 'rgba(205, 227, 255, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Rewards',
      balance: parseFloat(rewardsBalance),
      color: 'rgb(113, 175, 255)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }
  ];

  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  useEffect(() => {
    const name = "AURORA:" + account.accountName;
    for (const elem of totals) {
      if (elem.account === name) {
        setUsdValue(elem.total);
        break;
      }
    }
  }, [totals]);

  useEffect(() => {
    loadEthereumAccountBalance(account);
  }, [account])

  const copyToClipboard = () => {
    Clipboard.setString(account.address);
    Alert.alert('Address copied to Clipboard');
  };

  const loadEthereumAccountBalance = async account => {
    if (loaded) {
      return;
    }
    try {
      const ethBalanceInGwei = await getBalanceOfAccount("AURORA", account.address);
      const ethBalanceInEth = ethBalanceInGwei / ethMultiplier;
      setAccountBalance(parseFloat(ethBalanceInEth).toFixed(4));
    } catch (err) {
      log({
        description: 'loadEthereumAccountBalance',
        cause: err,
        location: 'AuroraAccountScreen',
      });
      return;
    } finally {
      setLoaded(true);
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
      'Delete Aurora Account',
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

  const _handlePressStake = () => {
    navigate('AuroraStake', { account });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.moreInner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={35}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <View style={styles.column}>
          <Image
            source={require('../../../assets/chains/aurora.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.addressLink} onPress={copyToClipboard}>
            {account.address}
          </Text>
        </View>
        <View style={styles.spacer} />
        <KText>Balance: {accountBalance} ETH</KText>
        <KText>USD Value: ${usdValue}</KText>
        <KText>Available: {availableBalance} AURORA</KText>
        <KText>Staked: {stakedBalance} AURORA</KText>
        <KText>Locked: {lockedBalance} AURORA</KText>
        <KText>Rewards: {rewardsBalance} AURORA</KText>

        <View style={styles.spacer} />
        <PieChart
          data={stakeData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="balance"
          backgroundColor="transparent"
          absolute
        />

        <KButton
          title={'Stake AURORA'}
          theme={'blue'}
          style={styles.button}
          onPress={_handlePressStake}
        />

        <FlatList />
        <TwoIconsButtons
          onIcon1Press={_handleBackupKey}
          onIcon2Press={_handleRemoveAccount}
          icon1={() => (
            <Image
              source={require('../../../assets/icons/save_key.png')}
              style={styles.buttonIcon}
            />
          )}
          icon2={() => (
            <Image
              source={require('../../../assets/icons/delete.png')}
              style={styles.buttonIcon}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(AuroraAccountScreen);
