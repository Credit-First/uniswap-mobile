import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';
import ChainAddressItem from './components/ChainAddressItem';
import ConnectAddressItem from './components/ConnectAddressItem';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';
import { stakeFioTokens, unstakeFioTokens } from '../../eos/fio';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { log } from '../../logger/logger';
import styles from './RegisterAddress.style';
import { KHeader, KText, KInput, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { getEndpoint } from '../../eos/chains';
import { getKeyPair } from '../../stellar/stellar';


const FIOStakeScreen = props => {

  const {
    navigation: { navigate, goBack },
    route: {
      params: { fioAccount, totalBalance, availableBalance, stakedBalance, lockedBalance, rewardsBalance },
    },
  } = props;

  const [newStake, setNewStake] = useState(0.0);
  const [newUnstake, setNewUnstake] = useState(0.0);


  const fioDivider = 1000000000;
  const privateKey = fioAccount.privateKey;
  const fioKey = Ecc.privateToPublic(privateKey);
  const fioEndpoint = getEndpoint('FIO');


  const onStake = async () => {
    if (!newStake) {
      Alert.alert("Staking amount not set!");
      return;
    }
    try {
      var floatAmount = parseFloat(newStake);
      if(floatAmount <= 0) {
        Alert.alert("Invalid staking amount: " + floatAmount);
        return;
      }
    } catch(err) {
      Alert.alert("Invalid staking amount: " + floatAmount);
      return;
    }
    const res = await stakeFioTokens(fioAccount, newStake);
    if (res && res.transaction_id) {
      Alert.alert('Successfully staked in tx ' + res.transaction_id);
    } else {
      let error = {
        description: 'Failed to stake FIO tokens',
        method: 'stakeFioTokens',
        location: 'FIOStakeScreen',
        cause: res,
        fioAccount: fioAccount.address,
        amount: newStake,
      };
      log(error);
      Alert.alert('Failed to stake FIO tokens.');
    }
  }

  const onUnstake = async () => {
    if (!newUnstake) {
      Alert.alert("Unstaking amount not set!");
      return;
    }
    try {
      var floatAmount = parseFloat(newUnstake);
      if(floatAmount <= 0) {
        Alert.alert("Invalid unstaking amount: " + floatAmount);
        return;
      }
    } catch(err) {
      Alert.alert("Invalid unstaking amount: " + floatAmount);
      return;
    }
    const res = await unstakeFioTokens(fioAccount, newUnstake);
    if (res && res.transaction_id) {
      Alert.alert('Successfully unstaked in tx ' + res.transaction_id);
    } else {
      let error = {
        description: 'Failed to unstake FIO tokens',
        method: 'unstakeFioTokens',
        location: 'FIOStakeScreen',
        cause: res,
        fioAccount: fioAccount.address,
        amount: newUnstake,
      };
      log(error);
      Alert.alert('Failed to unstake FIO tokens.');
    }
  }


  const getStakeForm = () => {
    if(availableBalance > 0) {
      return (<View>
        <KText>Stake FIO to earn rewards:</KText>
        <KInput
          placeholder={'Set new stake amount'}
          value={newStake}
          onChangeText={setNewStake}
          containerStyle={styles.inputContainer}
        />
        <KButton
          title={'Stake FIO'}
          theme={'brown'}
          style={styles.button}
          onPress={onStake}
        />
      </View>);
    } else {
      return null;
    }
  }

  const getUnstakeForm = () => {
    if(stakedBalance > 0) {
      return (<View>
        <KText>Unstake FIO (if you need to):</KText>
        <KInput
          placeholder={'Unstake FIO amount'}
          value={newUnstake}
          onChangeText={setNewUnstake}
          containerStyle={styles.inputContainer}
        />
        <KButton
          title={'Unstake FIO'}
          theme={'blue'}
          style={styles.button}
          onPress={onUnstake}
        />
      </View>);
    } else {
      return null;
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={35}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
         <Image
          source={require('../../../assets/chains/fio.png')}
          style={styles.buttonIcon}
         />
         <KHeader title={fioAccount.address} style={styles.header} />
        </View>
        <KText>Available: {availableBalance} FIO</KText>
        <KText>Staked: {stakedBalance} FIO</KText>
        <KText>Locked: {lockedBalance} FIO</KText>
        <KText>Rewards: {rewardsBalance} FIO</KText>
        <KText> </KText>
        {getStakeForm()}
        <KText> </KText>
        {getUnstakeForm()}
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(FIOStakeScreen);
