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


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <KButton title={'Register [address]@tribe'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={() => navigate('RegisterAddress')}/>
        <KButton title={'Register external account'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={() => navigate('FIORegisterExternal')}/>
        <KButton title={'Address Book'} style={styles.button} onPress={() => navigate('AddressBook')}/>
        <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={() => navigate('Exchange')}/>
      </View>
    </SafeAreaView>
    );

};

export default connectAccounts()(MenuScreen);
