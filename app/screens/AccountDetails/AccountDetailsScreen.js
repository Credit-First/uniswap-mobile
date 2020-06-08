import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { KHeader, KText } from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const AccountDetailsScreen = props => {
  const [liquidBalance, setLiquidBalance] = useState();
  const [cpuStaked, setCpuStaked] = useState();
  const [netStaked, setNetStaked] = useState();

  const {
    navigation: { navigate, goBack },
    route: {
      params: { action },
    },
    accountsState: { accounts }
  } = props;

  const account = accounts[action];

  const loadAccount = async (account) => {
    const chain = getChain(account.chainName);
    const accountInfo = await getAccount(account.accountName, chain);
    setLiquidBalance(accountInfo.core_liquid_balance);
    setCpuStaked(accountInfo.self_delegated_bandwidth.cpu_weight);
    setNetStaked(accountInfo.self_delegated_bandwidth.net_weight);
  };

  loadAccount(account);

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
            <KHeader
              title={account.accountName}
              subTitle={account.chainName}
              style={styles.header}
            />
            <View style={styles.spacer} />
            <KText>Available: {liquidBalance}</KText>
            <KText>CPU Staked: {cpuStaked}</KText>
            <KText>NET Staked: {netStaked}</KText>
          </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(AccountDetailsScreen);
