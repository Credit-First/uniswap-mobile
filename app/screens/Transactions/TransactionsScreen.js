import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Linking } from 'react-native';
import styles from './TransactionsScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { getActions } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import TransactionItem from './components/TransactionItem';
import { log } from '../../logger/logger';

const TransactionsScreen = props => {
  const {
    navigation,
    route: {
      params: { account },
    },
  } = props;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (!account) {
        return;
      }

      const chain = getChain(account.chainName);
      if (!chain) {
        return;
      }

      try {
        const res = await getActions(account.accountName, chain);
        setTransactions(res.actions);
      } catch (err) {
        setTransactions([]);
        log({
          description: 'Error loading actions',
          cause: err,
          location: 'TransactionsScreen',
        });
      }
    });

    return unsubscribe;
  }, [account]);

  const _handlePressTransaction = action => {
    // const { navigate } = navigation;
    //FIXME: Implement view transaction details
  };

  const _loadBloksHistory = () => {
    if (account.chainName === 'EOS') {
      Linking.openURL('https://bloks.io/account/' + account.accountName);
    } else if (account.chainName === 'Telos') {
      Linking.openURL('https://telos.bloks.io/account/' + account.accountName);
    } else if (account.chainName === 'TLOS') {
      Linking.openURL('https://telos.bloks.io/account/' + account.accountName);
    } else if (account.chainName === 'BOS') {
      Linking.openURL('https://bos.bloks.io/account/' + account.accountName);
    } else if (account.chainName === 'WAX') {
      Linking.openURL('https://wax.bloks.io/account/' + account.accountName);
    } else if (account.chainName === 'MEETONE') {
      Linking.openURL(
        'https://meetone.bloks.io/account/' + account.accountName,
      );
    } else if (account.chainName === 'FIO') {
      Linking.openURL('https://fio.bloks.io/address/' + account.address);
    } else if (account.chainName === 'ALGO') {
      Linking.openURL(
        'https://algoexplorer.io/address/' + account.account.addr,
      );
    }
  };

  const getAccountName = () => {
    if (!account) {
      return '';
    }
    if (account.chainName === 'FIO') {
      return account.chainName + ': ' + account.address;
    } else if (account.chainName === 'ALGO') {
      return account.chainName + ': ' + account.account.addr;
    } else {
      return account.chainName + ': ' + account.accountName;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader
          title={'Transactions'}
          subTitle={getAccountName()}
          style={styles.header}
        />
        <KButton
          title={'Load account history'}
          theme={'blue'}
          style={styles.button}
          onPress={_loadBloksHistory}
        />
        <FlatList
          style={styles.list}
          data={transactions}
          renderItem={({ item }) => (
            <TransactionItem
              onPress={() => _handlePressTransaction(item)}
              action={item}
              activeAccount={account}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransactionsScreen);
