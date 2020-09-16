import React, { useState } from 'react';
import { SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import { KHeader, KButton, KText, KInput } from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { getBalance, transfer } from '../../eos/tokens';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger'


const TokenDetailsScreen = props => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [toAccountName, setToAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts },
  } = props;

  const handleTokenBalance = (jsonArray) => {
    if(jsonArray && jsonArray.length > 0) {
      setTokenBalance(jsonArray[0]);
    } else if(account.token) {
      setTokenBalance('0 '+account.token.name);
    }
  }

  const getSubtitle = () => {
    return account.token.name + ' on ' + account.chainName;
  };

  const _handleTransfer = () => {
    transfer(toAccountName, parseFloat(amount), memo, account, account.token);
    Alert.alert('Transfer sent!');
    goBack();
  };

  getBalance(account.accountName, account.token, handleTokenBalance);

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
        <KHeader title={account.accountName} subTitle={getSubtitle()} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Balance: {tokenBalance}</KText>
        <KInput
          label={'Sending tokens to'}
          placeholder={'Enter account name'}
          value={toAccountName}
          onChangeText={setToAccountName}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KInput
          label={'Amount to send to'}
          placeholder={'Enter amount to send'}
          value={amount}
          onChangeText={setAmount}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
          keyboardType={'numeric'}
        />
        <KInput
          label={'Personal note'}
          placeholder={'Enter your message'}
          value={memo}
          onChangeText={setMemo}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <View style={styles.spacer} />
        <KButton
          title={'Submit transfer'}
          theme={'blue'}
          style={styles.button}
          onPress={_handleTransfer}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/transfer.png')}
              style={styles.buttonIcon}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TokenDetailsScreen);
