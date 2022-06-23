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
import { KInput, KText, KButton } from '../../components';
import styles from '../Ethereum/EthereumAccountScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import web3Module from '../../ethereum/ethereum';
import Wallet from 'ethereumjs-wallet';
import { log } from '../../logger/logger';
import { StackActions } from '@react-navigation/native';

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

const AuroaStakeScreen = props => {
  const [accountBalance, setAccountBalance] = useState();
  const [loaded, setLoaded] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [availableBalance, setAvailableBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [rewardsBalance, setRewardsBalance] = useState(0);

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

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

  const _handleStake = () => {

  };

  const _handleUnstake = () => {

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
        <KText>Available: {availableBalance} AURORA</KText>
        <KText>Staked: {stakedBalance} AURORA</KText>
        <KText>Locked: {lockedBalance} AURORA</KText>
        <KText>Rewards: {rewardsBalance} AURORA</KText>
        <View style={styles.spacer} />
        <KInput
          label={'Stake AURORA to earn rewards'}
          placeholder={'Enter amount to stake'}
          value={stakeAmount}
          onChangeText={setStakeAmount}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
          keyboardType={'numeric'}
        />
        <KButton
          title={'Stake AURORA'}
          theme={'brown'}
          style={styles.button}
          onPress={_handleStake}
        />
        <View style={styles.spacer} />
        <KInput
          label={'Unstake AURORA'}
          placeholder={'Enter amount to unstake'}
          value={stakeAmount}
          onChangeText={setStakeAmount}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
          keyboardType={'numeric'}
        />
        <KButton
          title={'Unstake AURORA'}
          theme={'blue'}
          style={styles.button}
          onPress={_handleUnstake}
        />

      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(AuroaStakeScreen);
