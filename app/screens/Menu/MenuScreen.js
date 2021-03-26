import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { get } from 'lodash';
import styles from './MenuScreen.style';
import { KHeader, KButton, KText, RequestSendButtons } from '../../components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import algosdk from 'algosdk';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';


const MenuScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, config },
  } = props;

  const telosAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'Telos';
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'ALGO';
  });

  const adminAccount = accounts.filter((value, index, array) => {
    return (value.chainName === 'FIO' && value.address === 'admin@tribe');
  });

  const _handleCreateAlgorandAccount = () => {
    try {
      var account = algosdk.generateAccount();
      var address = account.addr;
      var accountName = address.substring(0, 4) + ".." + address.substring(address.length - 4, address.length);
      var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      var algoAccount = { accountName, mnemonic, chainName: "ALGO", account: account };
      connectAccount(algoAccount);
      navigate('Accounts');
    } catch(err) {
      log({
        description: 'Error create/add Algorand account',
        cause: error,
        location: 'MenuScreen'
      });
    }
  };

  const _handleCreateTelosAccount = () => {
    navigate('CreateTelosAccount');
  };

  var displayExchange = false;
  if (accounts.length > 1) {
    var eosPresent = false;
    var anotherValidChain = false;
    accounts.map(function(account) {
      if (account.chainName === 'EOS') {
        eosPresent = true;
      } else if (account.chainName !== 'EOS'
        && account.chainName !== 'FIO'
        && account.chainName !== 'ALGO') {
        anotherValidChain = true;
      }
    });
    displayExchange = eosPresent && anotherValidChain;
  }

  var exchangeButton = <View style={styles.spacer} />;
  if(displayExchange) {
      exchangeButton = <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={() => navigate('Exchange')}/>;
  }

  var adminButton = <View style={styles.spacer} />;
  if(adminAccount.length > 0) {
    adminButton = <KButton title={'Admin'} style={styles.button} onPress={() => navigate('Admin')}/>;
  }

  if(telosAccounts.length == 0 && algoAccounts.length == 0) {
      return (
       <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <KHeader title={'Menu actions'} style={styles.header}/>
          <View style={styles.spacer} />
          <KButton title={'Create Telos account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateTelosAccount}/>
          <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
          <KButton title={'List all keys in wallet'} style={styles.button} onPress={() => navigate('KeyList')}/>
          {exchangeButton}
          {adminButton}
        </View>
      </SafeAreaView>
      );
    } else if(telosAccounts.length == 0) {
      return (
       <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <KHeader title={'Menu actions'} style={styles.header}/>
          <View style={styles.spacer} />
          <KButton title={'Create Telos account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateTelosAccount}/>
          <KButton title={'List all keys in wallet'} style={styles.button} onPress={() => navigate('KeyList')}/>
          {exchangeButton}
          {adminButton}
        </View>
      </SafeAreaView>
      );
  } else if(algoAccounts.length == 0) {
    return (
     <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
        <KButton title={'List all keys in wallet'} style={styles.button} onPress={() => navigate('KeyList')}/>
        {exchangeButton}
        {adminButton}
      </View>
    </SafeAreaView>
    );
  } else {
    return (
     <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'List all keys in wallet'} style={styles.button} onPress={() => navigate('KeyList')}/>
        {exchangeButton}
        {adminButton}
      </View>
    </SafeAreaView>
    );
  }

};

export default connectAccounts()(MenuScreen);
