import React, { useState } from 'react';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './TransferScreen.style';
import { KHeader, KButton, KInput } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { supportedChains } from '../../eos/chains';

const TransferScreen = props => {
  const [toAccountName, setToAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const [loading, setLoading] = useState(false);

  const {
    accountsState: { accounts, activeAccountIndex },
    navigation: { navigate },
  } = props;

  const _handleTransfer = async () => {
    const activeAccount = accounts[activeAccountIndex];
    if (!activeAccount) {
      return;
    }

    const chain = supportedChains.find(
      item => item.name === activeAccount.chainName,
    );
    if (!chain) {
      return;
    }

    try {
      const toAccount = await getAccount(toAccountName, chain);
      if (!toAccount) {
        Alert.alert('Please input valid account name');
        return;
      }
    } catch (e) {
      Alert.alert('Please input valid account name');
      return;
    }

    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
      return;
    }

    if (amount !== floatAmount.toString()) {
      Alert.alert('Please input valid amount1');
      return;
    }

    setLoading(true);
    try {
      await transfer(toAccountName, floatAmount, memo, activeAccount, chain);
      navigate('Transactions');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Alert.alert(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <KHeader
            title={'Transfer coins'}
            subTitle={'Move funds to another account'}
            style={styles.header}
          />
          <KInput
            label={'Sending to'}
            placeholder={'Enter username to send to'}
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
            isLoading={loading}
            renderIcon={() => (
              <Image
                source={require('../../../assets/icons/transfer.png')}
                style={styles.buttonIcon}
              />
            )}
            onPress={_handleTransfer}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransferScreen);
