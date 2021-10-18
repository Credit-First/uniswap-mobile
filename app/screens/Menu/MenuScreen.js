import React from 'react';
import { SafeAreaView, View } from 'react-native';
import algosdk from 'algosdk';
import { createKeyPair } from '../../stellar/stellar';

import styles from './MenuScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';

const MenuScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts },
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

  const _handleCreateAlgorandAccount = () => {
    try {
      var account = algosdk.generateAccount();
      var address = account.addr;
      var accountName =
        address.substring(0, 4) +
        '..' +
        address.substring(address.length - 4, address.length);
      var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      var algoAccount = {
        accountName,
        mnemonic,
        chainName: 'ALGO',
        account: account,
      };
      connectAccount(algoAccount);
      navigate('Accounts');
    } catch (err) {
      log({
        description: 'Error create/add Algorand account',
        cause: err,
        location: 'MenuScreen',
      });
    }
  };

  const _handleCreateTelosAccount = () => {
    navigate('CreateTelosAccount');
  };

  const _handleCreateStellarAccount = () => {
    try {
      const stellarKeys = createKeyPair();
      const privateKey = stellarKeys.secret();
      const address = stellarKeys.publicKey();
      var xlmAccount = {
        address: address,
        privateKey: privateKey,
        chainName: 'XLM',
      };
      connectAccount(xlmAccount);
      navigate('Accounts');
    } catch (err) {
      log({
        description: 'Error create/add Stellar account',
        cause: err,
        location: 'MenuScreen',
      });
    }
  };

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

  var createTelosButton = <View style={styles.spacer} />;
  if (telosAccounts.length === 0) {
    createTelosButton = (
      <KButton
        title={'Create Telos account'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
        onPress={_handleCreateTelosAccount}
      />
    );
  }

  var createAlgoButton = <View style={styles.spacer} />;
  if (algoAccounts.length === 0) {
    createAlgoButton = (
      <KButton
        title={'Create Algorand account'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
        onPress={_handleCreateAlgorandAccount}
      />
    );
  }

  var createStellarButton = <View style={styles.spacer} />;
  if (xlmAccounts.length === 0) {
    createStellarButton = (
      <KButton
        title={'Create Stellar account'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
        onPress={_handleCreateStellarAccount}
      />
    );
  }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <KHeader title={'Menu actions'} style={styles.header} />
          <View style={styles.spacer} />
          {createTelosButton}
          {createAlgoButton}
          {createStellarButton}
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
