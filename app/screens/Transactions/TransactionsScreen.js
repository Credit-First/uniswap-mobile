import React, { useState, useEffect } from 'react';
import { SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_BLUE } from '../../theme/colors';
import styles from './TransactionsScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { getActions } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import TransactionItem from './components/TransactionItem';
import { log } from '../../logger/logger';

const TransactionsScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;


  const _handlePressTransaction = (transaction) => {
    navigate('ResendTransfer', { transaction });
  };


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
          title={'Transactions'}
          style={styles.header}
        />
        <FlatList
          style={styles.list}
          data={history}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <TransactionItem
              onPress={() => _handlePressTransaction(item)}
              item={item}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransactionsScreen);
