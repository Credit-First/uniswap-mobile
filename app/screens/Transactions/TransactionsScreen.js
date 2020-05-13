import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';

import styles from './TransactionsScreen.style';
import { KHeader } from '../../components';
import { connectAccounts } from '../../redux';
import { getActions } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import TransactionItem from './components/TransactionItem';

const TransactionsScreen = props => {
  const {
    navigation,
    accountsState: { accounts, activeAccountIndex },
  } = props;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const activeAccount = accounts[activeAccountIndex];
      if (!activeAccount) {
        return;
      }

      const chain = getChain(activeAccount.chainName);
      if (!chain) {
        return;
      }

      try {
        const res = await getActions(activeAccount.accountName, chain);
        setTransactions(res.actions);
      } catch (e) {
        console.log('get actions failed with error: ', e);
        setTransactions([]);
      }
    });

    return unsubscribe;
  }, [navigation, accounts, activeAccountIndex]);

  const _handlePressTransaction = action => {
    const { navigate } = navigation;
    navigate('TransactionDetail', { action });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader
          title={'Transactions'}
          subTitle={'A list of previous transactions.'}
          style={styles.header}
        />
        <FlatList
          style={styles.list}
          data={transactions}
          renderItem={({ item }) => (
            <TransactionItem
              onPress={() => _handlePressTransaction(item)}
              action={item}
              activeAccount={accounts[activeAccountIndex]}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransactionsScreen);
