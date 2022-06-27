import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-native-chart-kit';
import {
  SafeAreaView,
  View,
  ScrollView,
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
import web3Module from '../../ethereum/ethereum';
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

const AuroraWithdrawScreen = props => {
  const [loaded, setLoaded] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [accountBalance, setAccountBalance] = useState();
  const [unlockedTime, setUnlockedTime] = useState('2 days');
  
  const [pendingAurora, setPendingAurora] = useState( 0.50388694);
  const [pendingUSN, setPendingUSN] = useState(0.0001);
  const [pendingBSTN, setPendingBSTN] = useState(0.0013);
  const [pendingTRI, setPendingTRI] = useState(0.0001);
  const [pendingPLY, setPendingPLY] = useState(0.0033);

  // Stake chart data:
  const stakeData = [
    {
      name: 'AURORA',
      balance: parseFloat(pendingAurora),
      color: 'rgba(42, 254, 106, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'USN',
      balance: parseFloat(pendingUSN),
      color: '#1b474c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'BSTN',
      balance: parseFloat(pendingBSTN),
      color: '#0f837a',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'TRI',
      balance: parseFloat(pendingTRI),
      color: '#aa21b9',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'PLY',
      balance: parseFloat(pendingPLY),
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
    decimalPlaces: 5, // optional, defaults to 2dp
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

  const _handleWithdrawAll = () => {

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
        <KText>Locked duration: {unlockedTime} </KText>
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
          <KButton
            title={'Withdraw all'}
            theme={'blue'}
            style={styles.button}
            onPress={_handleWithdrawAll}
          />
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView >
  );
};

export default connectAccounts()(AuroraWithdrawScreen);
