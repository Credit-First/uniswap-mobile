import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get } from 'lodash';

import styles from './ExchangeScreen.style';
import { KHeader, KButton, KInput, KSelect } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, newdexTransfer } from '../../eos/eos';
import { getChain } from '../../eos/chains';

const ExchangeScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [fromAccountBalance, setFromAccountBalance] = useState();
  const [sendAmount, setSendAmount] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [feeAmount, setFeeAmount] = useState();
  const [newdexPrice, setNewdexPrice] = useState();

  const [isSubmitting, setSubmitting] = useState(false);

  const {
    accountsState: { accounts },
  } = props;

  const _handleSubmit = async () => {
    if (!fromAccount || !toAccount || !sendAmount) {
      return;
    }

    const floatAmount = parseFloat(sendAmount);

    setSubmitting(true);
    try {
      const res = await newdexTransfer(floatAmount, fromAccount, toAccount);
      console.log('newdex transfer result', res);
      setSubmitting(false);
      Alert.alert('Exchange success');
    } catch (e) {
      setSubmitting(false);
      Alert.alert(e.message);
    }
  };

  useEffect(() => {
    const getNewdexPrice = async () => {
      const fromChain = getChain(fromAccount.chainName);
      const toChain = getChain(toAccount.chainName);
      if (!fromChain || !toChain) {
        return;
      }

      const symbol = `eosio.token-${toChain.symbol.toLowerCase()}-${fromChain.symbol.toLowerCase()}`;
      try {
        const res = await fetch(
          `https://api.newdex.io/v1/price?symbol=${symbol}`,
        );
        const resJson = await res.json();
        const price = get(resJson, 'data.price');

        setNewdexPrice(price);
      } catch (e) {
        console.log('get newdex price failed with error', e);
      }
    };

    if (!fromAccount || !toAccount) {
      return;
    }
    getNewdexPrice();
  }, [fromAccount, toAccount]);

  useEffect(() => {
    const sendQuantity = parseFloat(sendAmount);
    if (!sendQuantity || !newdexPrice || !toAccount) {
      return;
    }
    const toChain = getChain(toAccount.chainName);

    const receiveQuantity = `${((sendQuantity * 0.99) / newdexPrice).toFixed(
      4,
    )} ${toChain.symbol}`;
    const feeQuantity = `${((sendQuantity * 0.01) / newdexPrice).toFixed(4)} ${
      toChain.symbol
    }`;
    setReceiveAmount(receiveQuantity);
    setFeeAmount(feeQuantity);
  }, [sendAmount, newdexPrice, toAccount]);

  const _handleFromAccountChange = async account => {
    setFromAccount(account);

    const chain = getChain(account.chainName);
    if (!chain) {
      return;
    }

    try {
      const accountInfo = await getAccount(account.accountName, chain);
      if (!accountInfo) {
        console.log('could not get account info');
      }

      setFromAccountBalance(accountInfo.core_liquid_balance);
    } catch (e) {
      Alert.alert('Please input valid account name');
      return;
    }
  };

  const _handleToAccountChange = value => {
    setToAccount(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <KHeader
            title={'Convert coins'}
            subTitle={'Convert coins across your accounts'}
            style={styles.header}
          />
          <KSelect
            label={'From account'}
            items={accounts.map(item => ({
              label: `${item.chainName}: ${item.accountName}`,
              value: item,
            }))}
            onValueChange={_handleFromAccountChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Amount to exchange'}
            placeholder={'Enter amount to exchange'}
            value={sendAmount}
            onChangeText={setSendAmount}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KInput
            label={'Balance'}
            placeholder={'Account balance'}
            value={fromAccountBalance}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={false}
          />
          <View style={styles.spacer} />
          <KSelect
            label={'To account'}
            items={accounts.map(item => ({
              label: `${item.chainName}: ${item.accountName}`,
              value: item,
            }))}
            onValueChange={_handleToAccountChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Receive'}
            placeholder={'Receive amount'}
            value={receiveAmount}
            containerStyle={styles.inputContainer}
            editable={false}
          />
          <KInput
            label={'Fee'}
            placeholder={'Fee amount'}
            value={feeAmount}
            containerStyle={styles.inputContainer}
            editable={false}
          />
          <KButton
            title={'Submit'}
            theme={'blue'}
            style={styles.button}
            isLoading={isSubmitting}
            icon={'check'}
            onPress={_handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(ExchangeScreen);
