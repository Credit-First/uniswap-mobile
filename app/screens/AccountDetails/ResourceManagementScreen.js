import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KHeader, KButton, KText, KInput } from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { getAccount, stake, buyram } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';


const ResourceManagementScreen = props => {
  // Form values:
  const [cpuNewStaked, setCpuNewStaked] = useState(0);
  const [netNewStaked, setNetNewStaked] = useState(0);
  const [newRamAmount, setNewRamAmount] = useState(0);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingRAM, setLoadingRAM] = useState(false);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account, params },
    },
  } = props;

  const _handleCpuNetStake = async () => {
    let cpuStake = parseFloat(cpuNewStaked);
    if (isNaN(cpuStake)) {
      Alert.alert('Please input valid amount for CPU stake');
      return;
    }
    let netStake = parseFloat(netNewStaked);
    if (isNaN(netStake)) {
      Alert.alert('Please input valid amount for NET stake');
      return;
    }
    let totalStake = cpuStake + netStake;
    let totalAvailable = parseFloat(params.liquidNumber);
    if (totalStake > totalAvailable) {
      Alert.alert('Can not stake more then available balance');
      return;
    }
    let chain = getChain(account.chainName);
    if (!chain) { // Should never happen
      Alert.alert('Unknown chain: '+account.chainName);
      return;
    }
    // Do Staking:
    setLoadingStake(true);
    try {
      await stake(account, cpuStake, netStake, chain);
      setLoadingStake(false);
      Alert.alert('Successfully staked! Reload account details screen to see new stats.');
    } catch(err) {
      console.log(err);
      setLoadingStake(false);
    }
  }

  const _handleBuyRam = async () => {
    let ramAmount = parseFloat(newRamAmount);
    if (isNaN(ramAmount)) {
      Alert.alert('Please input valid amount to buy RAM');
      return;
    }
    let totalAvailable = parseFloat(params.liquidNumber);
    if (ramAmount > totalAvailable) {
      Alert.alert('Can not use more then available balance');
      return;
    }
    let chain = getChain(account.chainName);
    if (!chain) { // Should never happen
      Alert.alert('Unknown chain: '+account.chainName);
      return;
    }
    setLoadingRAM(true);
    try {
      await buyram(account, ramAmount, chain);
      setLoadingRAM(false);
      Alert.alert('Successfully bought RAM! Reload account details screen to see new stats.');
    } catch(err) {
      console.log(err);
      setLoadingRAM(false);
    }
  }

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
            title={'Resource management'}
            subTitle={account.accountName}
            style={styles.header}
          />
          <KText>Available balance: {params.liquidBalance}</KText>
          <KText>Staked CPU/NET: {params.cpuStaked} / {params.netStaked}</KText>
          <View style={styles.spacer} />
          <KInput
            label={'Stake for CPU'}
            placeholder={'Enter amount to stake for CPU'}
            value={cpuNewStaked}
            onChangeText={setCpuNewStaked}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KInput
            label={'Stake for NET'}
            placeholder={'Enter amount to stake for NET'}
            value={netNewStaked}
            onChangeText={setNetNewStaked}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KButton
            title={'Stake for CPU / NET'}
            theme={'blue'}
            style={styles.button}
            icon={'add'}
            onPress={_handleCpuNetStake}
          />
          <View style={styles.spacer} />
          <KText>
            RAM Used/Quota: {params.ramUsed}/{params.ramQuota} bytes
          </KText>
          <KInput
            label={'Buy RAM'}
            placeholder={'Enter amount to buy RAM'}
            value={newRamAmount}
            onChangeText={setNewRamAmount}
            isLoading={loadingStake}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KButton
            title={'Buy RAM'}
            theme={'blue'}
            style={styles.button}
            icon={'add'}
            isLoading={loadingRAM}
            onPress={_handleBuyRam}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(ResourceManagementScreen);
