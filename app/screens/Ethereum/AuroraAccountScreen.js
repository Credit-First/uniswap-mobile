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
  ScrollView,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KText, KButton, TwoIconsButtons } from '../../components';
import styles from './EthereumAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import web3Module from '../../ethereum/ethereum';
import { log } from '../../logger/logger';

const ethMultiplier = 1000000000000000000;
const tokenABI = require('../../ethereum/abi.json');
const tokenAddress = "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79";
const {
  getBalanceOfAccount,
  getBalanceOfTokenOfAccount
} = web3Module({
  tokenABI,
  tokenAddress,
  decimals: 18
});

const AuroraAccountScreen = props => {
  const [loaded, setLoaded] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    deleteAccount,
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [accountBalance, setAccountBalance] = useState();
  const [availableBalance, setAvailableBalance] = useState();

  const [aprTotal, setAprTotal] = useState(101);
  const [aprAurora, setAprAurora] = useState(42.05);
  const [aprUSN, setAprUSN] = useState(53.19);
  const [aprBSTN, setAprBSTN] = useState(2.96);
  const [aprTRI, setAprTRI] = useState(0.16);
  const [aprPLY, setAprPLY] = useState(2.56);

  // Stake chart data:
  const stakeData = [
    {
      name: '% (AURORA)',
      balance: parseFloat(aprAurora),
      color: 'rgba(42, 254, 106, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: '% (USN)',
      balance: parseFloat(aprUSN),
      color: '#1b474c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: '% (BSTN)',
      balance: parseFloat(aprBSTN),
      color: '#0f837a',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: '% (TRI)',
      balance: parseFloat(aprTRI),
      color: '#aa21b9',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: '% (PLY)',
      balance: parseFloat(aprPLY),
      color: '#169545',
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

      const auroraBalance = await getBalanceOfTokenOfAccount("AURORA", account.address);
      setAvailableBalance(parseFloat(auroraBalance).toFixed(4));
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

  const _handlePressUnstake = () => {
    navigate('AuroraUnstake', { account });
  };

  const _handlePressWithdraw = () => {
    navigate('AuroraWithdraw', { account });
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
        <KText>Available: {availableBalance} AURORA</KText>
        <KText>Total APR: {aprTotal} %</KText>
        <View style={styles.spacer} />
        <ScrollView style={styles.scrollView}>
          <PieChart
            data={stakeData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="balance"
            backgroundColor="transparent"
            absolute
          />
          <View style={styles.buttonColumn}>
            <KButton
              title={'Stake AURORA'}
              theme={'blue'}
              style={styles.smallButton}
              onPress={_handlePressStake}
            />
            <KButton
              title={'Unstake AURORA'}
              theme={'brown'}
              style={styles.smallButton}
              onPress={_handlePressUnstake}
            />
          </View>
          <KButton
            title={'5 withdrawals in cooldown'}
            theme={'blue'}
            style={styles.button}
            onPress={_handlePressWithdraw}
          />
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(AuroraAccountScreen);
