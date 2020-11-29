import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { get } from 'lodash';
import styles from './MenuScreen.style';
import { KHeader, KButton, KText, RequestSendButtons } from '../../components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import algosdk from 'algosdk';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { getFioChatEndpoint, fioAddPublicAddress } from '../../eos/fio';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain, getEndpoint } from '../../eos/chains';
import { getTokens } from '../../eos/tokens';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger';


const MenuScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts },
  } = props;

  const telosAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'Telos';
  });

  const _handleFIORequest = () => {
    navigate('FIORequest');
  };

  const _handleFIOSend = () => {
    navigate('FIOSend');
  };

  const _handleRegisterAddress = () => {
    navigate('RegisterAddress');
  };

  const _handleCreateAlgorandAccount = () => {
    var account = algosdk.generateAccount();
    var address = account.addr;
    var accountName = address.substring(0, 4) + ".." + address.substring(address.length - 4, address.length);
    var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    var algoAccount = { accountName, mnemonic, chainName: "ALGO", account: account };
    connectAccount(algoAccount);
    navigate('Accounts');
  };

  const _handleCreateTelosAccount = () => {
    navigate('CreateTelosAccount');
  };

  if(telosAccounts.length == 0) {
    return (
     <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'Create Telos account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateTelosAccount}/>
        <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
        <KButton title={'Register external account'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={() => navigate('FIORegisterExternal')}/>
        <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={() => navigate('Exchange')}/>
      </View>
    </SafeAreaView>
    );
  } else {
    return (
     <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
        <KButton title={'Register external account'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={() => navigate('FIORegisterExternal')}/>
        <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={() => navigate('Exchange')}/>
      </View>
    </SafeAreaView>
    );
  }

};

export default connectAccounts()(MenuScreen);
