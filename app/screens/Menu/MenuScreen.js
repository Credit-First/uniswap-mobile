import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { get } from 'lodash';
import styles from './MenuScreen.style';
import { KHeader, KButton, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';


const MenuScreen = props => {
  const {
    navigation: { navigate },
  } = props;

  // Extra wallet actions:
  const _handleRegisterAddress = () => {
    navigate('RegisterAddress');
  };

  const _handleConnectExternalAccount = () => {
    navigate('FIORegisterExternal');
  }

  const _handleExchange = () => {
    navigate('Exchange');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'Register [address]@tribe'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>
        <KButton title={'Register external account'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={_handleConnectExternalAccount}/>
        <KButton
          title={'Import Accounts'}
          theme={'blue'}
          style={styles.button}
          onPress={() => navigate('ConnectAccount')}
        />
        <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={_handleExchange}/>
      </View>
    </SafeAreaView>
    );

};

export default connectAccounts()(MenuScreen);
