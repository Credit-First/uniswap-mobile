/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './TransactionsScreen.style';
import { KHeader } from '../../components';
import { connectAccounts } from '../../redux';
import { getActions } from '../../eos/eos';
import supportedChains from '../../eos/chains';

const TransactionsScreen = props => {
  const {
    accountsState: { accounts, activeAccountIndex },
  } = props;

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
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
      const actions = await getActions(activeAccount.name, chain);
      console.log(actions);
    } catch (e) {
      console.log('get actions failed with error: ', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <KHeader
            title={'Transactions'}
            subTitle={'A list of previous transactions.'}
            style={styles.header}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransactionsScreen);
