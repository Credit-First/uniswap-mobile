import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { get } from 'lodash';
import styles from './MenuScreen.style';
import { KHeader, KButton, KText, RequestSendButtons } from '../../components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';


const MenuScreen = props => {
  const {
    navigation: { navigate },
  } = props;

  const _handleFIORequest = () => {
    navigate('FIORequest');
  };

  const _handleFIOSend = () => {
    navigate('FIOSend');
  };

  const _handleRegisterAddress = () => {
    navigate('RegisterAddress');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header}/>
        <View style={styles.spacer} />
        <RequestSendButtons
            style={styles.button}
            onRequestPress={_handleFIORequest}
            onSendPress={_handleFIOSend}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/transfer.png')}
              style={styles.buttonIcon}
            />
            )}
        />
        <KButton title={'Register [address]@tribe'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>
        <KButton title={'Register external account'} theme={'brown'}
        style={styles.button} icon={'add'} onPress={() => navigate('FIORegisterExternal')}/>
        <KButton title={'EOSIO NewDex Exchange'} style={styles.button} onPress={() => navigate('Exchange')}/>
      </View>
    </SafeAreaView>
    );

};

export default connectAccounts()(MenuScreen);
