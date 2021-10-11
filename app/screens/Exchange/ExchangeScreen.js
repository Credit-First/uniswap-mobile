import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './ExchangeScreen.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, newdexTransfer } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { getNewdexPrice } from '../../eos/exchange';

const ExchangeScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [fromAccountBalance, setFromAccountBalance] = useState();
  const [sendAmount, setSendAmount] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [feeAmount, setFeeAmount] = useState();
  const [newdexPrice, setNewdexPrice] = useState();
  const [isSubmitting, setSubmitting] = useState(false);

  const MAX_AMOUNT = 1000;

  const {
    navigation: { navigate },
    accountsState: { accounts },
  } = props;

  const filteredAccounts = accounts.filter((value, index, array) => {
    return value.chainName !== 'FIO' && value.chainName !== 'ALGO';
  });

  const _handleSubmit = async () => {
    if (!fromAccount || !toAccount || !sendAmount) {
      return;
    }
    var valid = false;
    if (fromAccount.chainName === toAccount.chainName) {
      valid = false;
    } else if (fromAccount.chainName === 'EOS') {
      valid = true;
    } else if (toAccount.chainName === 'EOS') {
      valid = true;
    }
    if (!valid) {
      Alert.alert('Invalid exchange pair: must include EOS.');
      return;
    }

    const floatAmount = parseFloat(sendAmount);
    if (floatAmount > MAX_AMOUNT) {
      Alert.alert(
        'We do not recommended to submit large amount market orders.',
      );
      return;
    }

    let chain = getChain(fromAccount.chainName);
    const accountInfo = await getAccount(fromAccount.accountName, chain);
    let liquidBalance = parseFloat(
      accountInfo.core_liquid_balance.split(' ')[0],
    );
    let token = accountInfo.core_liquid_balance.split(' ')[1];
    if (floatAmount > liquidBalance) {
      Alert.alert(
        'Amount is more then account liquid balance: ' +
          liquidBalance +
          ' ' +
          token,
      );
      return;
    }

    setSubmitting(true);
    try {
      await newdexTransfer(floatAmount, fromAccount, toAccount);
      setSubmitting(false);
      Alert.alert('Market order submitted to Newdex for processing!');
    } catch (e) {
      setSubmitting(false);
      Alert.alert(e.message);
    }
  };

  useEffect(() => {
    const getPrice = async (fromAcc, toAcc) => {
      const price = await getNewdexPrice(fromAcc, toAcc);
      setNewdexPrice(price);
    };
    // pre-validation:
    if (!fromAccount || !toAccount) {
      return;
    } else if (fromAccount.chainName === toAccount.chainName) {
      return;
    }

    getPrice(fromAccount, toAccount);
  }, [fromAccount, toAccount]);

  useEffect(() => {
    const sendQuantity = parseFloat(sendAmount);
    if (!sendQuantity || !newdexPrice || !toAccount) {
      return;
    }

    const fromChain = getChain(fromAccount.chainName);
    const toChain = getChain(toAccount.chainName);

    const receiveQuantity = `${(sendQuantity * 0.99 * newdexPrice).toFixed(
      4,
    )} ${toChain.symbol}`;
    const feeQuantity = `${(sendQuantity * 0.01).toFixed(4)} ${
      fromChain.symbol
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
        Alert.alert('Could not load account info for ' + account.accountName);
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

  var displayExchange = false;
  if (accounts.length > 1) {
    var eosPresent = false;
    var anotherValidChain = false;
    accounts.map(function(account) {
      if (account.chainName === 'EOS') {
        eosPresent = true;
      } else if (
        account.chainName !== 'EOS' &&
        account.chainName !== 'FIO' &&
        account.chainName !== 'ALGO'
      ) {
        anotherValidChain = true;
      }
    });
    displayExchange = eosPresent && anotherValidChain;
  }

  if (displayExchange) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContentContainer}
          enableOnAndroid>
          <View style={styles.inner}>
            <KHeader
              title={'Convert coins in your accounts'}
              subTitle={'Convert coins using Newdex exchange'}
              style={styles.header}
            />
            <KSelect
              label={'From account'}
              items={filteredAccounts.map(item => ({
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
              items={filteredAccounts.map(item => ({
                label: `${item.chainName}: ${item.accountName}`,
                value: item,
              }))}
              onValueChange={_handleToAccountChange}
              containerStyle={styles.inputContainer}
            />
            <KInput
              label={'Receive (*)'}
              placeholder={'Receive amount'}
              value={receiveAmount}
              containerStyle={styles.inputContainer}
              editable={false}
            />
            <KInput
              label={'Fee: 1% of send amount'}
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
            <KText>
              (*) Note: exact receive amount depends on final market order
              execution at Newdex.io exchange.
            </KText>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContentContainer}
          enableOnAndroid>
          <View style={styles.inner}>
            <KHeader
              title={'Convert coins'}
              subTitle={'This feature not available for imported account(s)'}
              style={styles.header}
            />
            <KButton
              title={'Connect more accounts'}
              theme={'blue'}
              style={styles.button}
              onPress={() => navigate('ConnectAccount')}
              renderIcon={() => (
                <Image
                  source={require('../../../assets/icons/accounts.png')}
                  style={styles.buttonIcon}
                />
              )}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(ExchangeScreen);
