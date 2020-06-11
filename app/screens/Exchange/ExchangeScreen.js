import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './ExchangeScreen.style';
import { KHeader, KButton, KInput, KSelect } from '../../components';
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


  const {
    navigation: { navigate },
    accountsState: { accounts },
  } = props;

  const filteredAccounts = accounts.filter((value, index, array) => {
    return (value.chainName != 'FIO');
  });

  const _handleSubmit = async () => {
    if (!fromAccount || !toAccount || !sendAmount) {
      return;
    }
    var valid = false;
    if (fromAccount.chainName == toAccount.chainName) {
      valid = false;
    } else if (fromAccount.chainName == 'EOS') {
      valid = true;
    } else if (toAccount.chainName == 'EOS') {
      valid = true;
    }
    if(!valid) {
      Alert.alert('Invalid exchange pair: must include EOS.');
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
    const getPrice = async (fromAcc, toAcc) => {
      const price = await getNewdexPrice(fromAcc, toAcc);
      setNewdexPrice(price);
    };
    // pre-validation:
    if (!fromAccount || !toAccount) {
      return;
    } else if (fromAccount.chainName == toAccount.chainName) {
      return;
    }


    getPrice(fromAccount, toAccount);
  }, [fromAccount, toAccount]);

  useEffect(() => {
    const sendQuantity = parseFloat(sendAmount);
    if (!sendQuantity || !newdexPrice || !toAccount) {
      return;
    }

    const toChain = getChain(toAccount.chainName);

    const receiveQuantity = `${(sendQuantity * 0.99 * newdexPrice).toFixed(
      4,
    )} ${toChain.symbol}`;
    const feeQuantity = `${(sendQuantity * 0.01 * newdexPrice).toFixed(4)} ${
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

  var displayExchange = false;
  if (accounts.length > 1) {
    var eosPresent = false;
    var anotherValidChain = false;
    accounts.map(function(account){
      if (account.chainName == 'EOS') {
        eosPresent = true;
      } else if (account.chainName != 'EOS' && account.chainName != 'FIO') {
        anotherValidChain = true;
      } 
    });
    displayExchange = (eosPresent && anotherValidChain);
  }

if (displayExchange) {
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
