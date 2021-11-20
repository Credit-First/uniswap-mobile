import React, { useState } from 'react';
import { Fio } from '@fioprotocol/fiojs';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './TransferScreen.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { sendFioTransfer } from '../../eos/fio';
import { submitAlgoTransaction } from '../../algo/algo';
import { getChain, getEndpoint } from '../../eos/chains';
import { loadAccount, submitStellarPayment, createStellarAccount } from '../../stellar/stellar';
import { log } from '../../logger/logger';

const ResendTransferScreen = props => {

  const [loading, setLoading] = useState(false);

  const {
    addHistory,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
    route: {
      params: { transaction },
    },
  } = props;

  const [amount, setAmount] = useState(transaction.amount);

  let fromAccount = null;
  if(fromAccount == null) {
    accounts.map((value, index, array) => {
      if(value.chainName == transaction.chain) {
        let valName = (value.address) ? value.address : value.accountName;
        if(valName && valName == transaction.sender) {
          fromAccount = value;
        }
      }
    });
  }

  const getSender = () => {
    let sender = "";
    if(transaction.sender.address) {
      sender = transaction.sender.address;
    } else if(transaction.sender.accountName) {
      sender = transaction.sender.accountName;
    } else {
      sender = transaction.sender;
    }
    if(sender.length > 20) {
      return sender.substring(0,20) + "..";
    }
    return sender;
  };

  const getReceiver = () => {
    if(transaction.isFioAddress) {
      return transaction.toFioAddress;
    } else {
      return transaction.receiver;
    }
  };

  const addTransactionToHistory = newtrx => {
    if(transaction.isFioAddress) {
      newtrx.isFioAddress = transaction.isFioAddress;
      newtrx.toFioAddress = transaction.toFioAddress;
    }
    addHistory(newtrx);
    Alert.alert('Transfer completed: ' + newtrx.txid);
    navigate('Transactions');
  };

  const _handleTransfer = async () => {
    if(fromAccount == null) {
      Alert.alert('Source account not found in wallet!');
      return;
    }
    if(loading) {
      Alert.alert('Already processing transfer!');
      return;
    }
    setLoading(true);
    // Validate amount:
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
      return;
    }

    let chain = getChain(transaction.chain);

    // From account validation
    try {
      setLoading(true);
      if (transaction.chain === 'ALGO') {
        await submitAlgoTransaction(
          fromAccount,
          transaction.receiver,
          floatAmount,
          transaction.memo,
          addTransactionToHistory,
        );
      } else if (transaction.chain === 'XLM') {
        await submitStellarPayment(
          fromAccount,
          transaction.receiver,
          floatAmount,
          transaction.memo,
          addTransactionToHistory,
        );
      } else if (fromAccount.chainName === 'FIO') {
        await sendFioTransfer(
          fromAccount,
          transaction.receiver,
          floatAmount,
          transaction.memo,
          addTransactionToHistory,
        );
      } else if (chain) {
        // Any of supported EOSIO chains:
        let result = await transfer(
          transaction.receiver,
          floatAmount,
          transaction.memo,
          fromAccount,
          chain);
        transaction.amount = floatAmount;
        addTransactionToHistory(transaction);
      } else {
        Alert.alert('Unsupported transfer state!');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({
        description: '_handleTransfer - resend transaction',
        transaction: transaction,
        cause: err.message,
        location: 'ResendTransferScreen',
      });
    } finally {
      setLoading(false);
    }
  };

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContentContainer}
          enableOnAndroid>
          <View style={styles.inner}>
            <KHeader
              title={'Resend transfer'}
              style={styles.header}
            />
            <KText>From: {getSender()}</KText>
            <KText>To: {getReceiver()}</KText>
            <KText>Memo: {transaction.memo}</KText>
            <KInput
              label={'Enter amount to send'}
              value={amount}
              placeholder={'Original amount sent: '+amount}
              onChangeText={setAmount}
              containerStyle={styles.inputContainer}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
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
            <View style={styles.spacer} />
            <KButton
              title={'Past transfers'}
              theme={'brown'}
              style={styles.button}
              renderIcon={() => (
                <Image
                  source={require('../../../assets/icons/transactions.png')}
                  style={styles.buttonIcon}
                />
              )}
              onPress={() => navigate('Transactions')}
            />
            <View style={styles.spacer} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );

};

export default connectAccounts()(ResendTransferScreen);
