import React from 'react';
import { SafeAreaView, View } from 'react-native';

import styles from './MenuScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';

const MenuScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const telosAccounts = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'Telos');
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'ALGO');
  });

  const xlmAccounts = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'XLM');
  });

  const adminAccount = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'FIO' && value.address === 'admin@tribe');
  });


  var displayExchange = false;
  if (accounts.length > 1) {
    var eosPresent = false;
    var anotherValidChain = false;
    accounts.map(function(account) {
      if (account.chainName === 'EOS') {
        eosPresent = true;
      } else if (account.chainName === 'Telos'||account.chainName === 'TLOS') {
        anotherValidChain = true;
      }
    });
    displayExchange = eosPresent && anotherValidChain;
  }

  var exchangeButton = <View style={styles.spacer} />;
  if (displayExchange) {
    exchangeButton = (
      <KButton
        title={'EOSIO NewDex Exchange'}
        style={styles.button}
        onPress={() => navigate('Exchange')}
      />
    );
  }

  var adminButton = <View style={styles.spacer} />;
  if (adminAccount.length > 0) {
    adminButton = (
      <KButton
        title={'Admin'}
        style={styles.button}
        onPress={() => navigate('Admin')}
      />
    );
  }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <KHeader title={'Menu actions'} style={styles.header} />
          <View style={styles.spacer} />
          <KButton
            title={'Recover Private Key'}
            style={styles.button}
            onPress={() => navigate('RecoverPrivateKey')}
          />
          <KButton
            title={'List all keys in wallet'}
            style={styles.button}
            onPress={() => navigate('KeyList')}
          />
          {exchangeButton}
          {adminButton}
        </View>
      </SafeAreaView>
    );

};

export default connectAccounts()(MenuScreen);
