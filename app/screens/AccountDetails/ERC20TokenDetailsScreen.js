import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  KHeader,
  KButton,
  KText,
  KInput,
  OneIconButton,
  ThreeIconsButtons,
} from '../../components';
import styles from './AccountDetailsScreen.style';
import TransactionListItem from './components/TransactionListItem';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain, getEndpoint } from '../../eos/chains';
import { getBalance, transferToken } from '../../eos/tokens';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';
import web3Module from '../../ethereum/ethereum';

const tokenABI = require('../../ethereum/abi.json');

const ERC20TokenDetailsScreen = props => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [toAccountName, setToAccountName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [amount, setAmount] = useState('');
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account, token: token },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const {
    getBalanceOfTokenOfAccount,
    transterERC20
  } = web3Module({
    tokenABI,
    tokenAddress: token.address,
    decimals: token.decimals
  });

  const _handleToAccountChange = value => {
    // trim white space if present:
    if(value.indexOf(' ') >= 0) {
      value = value.trim();
    }

    setToAccountName(value);
  };

  const refreshBalances = async () => {
    const balance = await getBalanceOfTokenOfAccount(account.chainName, account.address);
    setTokenBalance(balance);
    setLoaded(true);
    setShowTransfer(true);
  };

  if (!loaded) {
    refreshBalances();
  }

  const _handlePressTransaction = trans => {

  };

  const getSubtitle = () => {
    return token.name + ' on ' + account.chainName;
  };

  const _handleTransfer = async () => {
    //transterERC20: async (chainName, account, toAddress, amount, gasLimit = 300000, gasPrice = 20000000000) => {
      const result = await transterERC20(account.chainName, account, toAccountName, amount);
      console.log(">>>>>>>>>>>_handleTransfer:", result);
  };

  const getTransferFormLabel = () => {
    return 'Transfer ' + token.name + ' tokens: ';
  };

  if (showTransfer) {
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
          <KHeader
            title={account.accountName}
            subTitle={getSubtitle()}
            style={styles.header}
          />
          <KText>Balance: {tokenBalance}</KText>
          <KInput
            label={getTransferFormLabel()}
            placeholder={'Enter receiver account name'}
            value={toAccountName}
            onChangeText={_handleToAccountChange}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
          <KInput
            label={'Amount to send'}
            placeholder={'Enter amount to send'}
            value={amount}
            onChangeText={setAmount}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KButton
            title={'Submit transfer'}
            theme={'blue'}
            style={styles.button}
            onPress={_handleTransfer}
          />
          <View style={styles.spacer} />
          <OneIconButton
            onIconPress={() => setShowTransfer(false)}
            icon={() => (
              <Image
                source={require('../../../assets/icons/history.png')}
                style={styles.buttonIcon}
              />
            )}
          />
        </View>
      </SafeAreaView>
    );
  } else {
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
          <KHeader
            title={account.accountName}
            subTitle={getSubtitle()}
            style={styles.header}
          />
          <KText>Balance: {tokenBalance}</KText>
          <FlatList
            data={transactions}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => (
              <TransactionListItem
                transaction={item}
                style={styles.listItem}
                onPress={() => _handlePressTransaction(item)}
              />
            )}
          />
        </View>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(ERC20TokenDetailsScreen);
