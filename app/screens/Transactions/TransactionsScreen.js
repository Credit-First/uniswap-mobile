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
    navigation: { navigate, goBack },
    route: {
      params: { account },
    }
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
        log({ description: 'Error loading actions', cause: err, location: 'TransactionsScreen'});
      }
    });

    return unsubscribe;
  }, [account]);

  const _handlePressTransaction = action => {
    const { navigate } = navigation;
    navigate('TransactionDetail', { action });
  };

  const _loadBloksHistory = () => {
    if (activeAccount.chainName === 'EOS') {
      Linking.openURL('https://bloks.io/account/' + activeAccount.accountName);
    } else if (activeAccount.chainName === 'Telos') {
      Linking.openURL(
        'https://telos.bloks.io/account/' + activeAccount.accountName,
      );
    } else if (activeAccount.chainName === 'TLOS') {
      Linking.openURL(
        'https://telos.bloks.io/account/' + activeAccount.accountName,
      );
    } else if (activeAccount.chainName === 'BOS') {
      Linking.openURL(
        'https://bos.bloks.io/account/' + activeAccount.accountName,
      );
    } else if (activeAccount.chainName === 'WAX') {
      Linking.openURL(
        'https://wax.bloks.io/account/' + activeAccount.accountName,
      );
    } else if (activeAccount.chainName === 'MEETONE') {
      Linking.openURL(
        'https://meetone.bloks.io/account/' + activeAccount.accountName,
      );
    } else if (activeAccount.chainName === 'FIO') {
      Linking.openURL(
        'https://fio.bloks.io/address/' + activeAccount.address,
      );
    } else if (activeAccount.chainName === 'ALGO') {
      Linking.openURL(
        'https://algoexplorer.io/address/' + activeAccount.account.addr,
      );
    }
  };

  const getAccountName = () => {
    if(!activeAccount) {
      return '';
    }
    if(activeAccount.chainName === 'FIO') {
      return activeAccount.chainName + ": " + activeAccount.address;
    } else if(activeAccount.chainName === 'ALGO') {
      return activeAccount.chainName + ": " + activeAccount.account.addr;
    } else {
      return activeAccount.chainName + ": " + activeAccount.accountName;
    }
  }

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
