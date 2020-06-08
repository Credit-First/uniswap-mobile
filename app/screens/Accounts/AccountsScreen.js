import React, { useState } from 'react';
import { Image, FlatList, Linking, SafeAreaView } from 'react-native';

import { KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import AccountListItem from './components/AccountListItem';

const AccountsScreen = props => {
  const {
    navigation: { navigate },
    accountsState: { accounts, activeAccountIndex },
    chooseActiveAccount,
  } = props;

  const _handleCreateAccount = () => {
    Linking.openURL('https://eostribe.io/newaccount/index.html');
  };

  const _handleCheckAccount = index => {
    chooseActiveAccount(index);
  };

  const _handlePressAccount = action => {
    navigate('AccountDetails', { action });
  };


  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{flex:1, height: undefined, width: undefined}}
        source={require('../../../assets/logo/tribe-logo.png')}
        resizeMode="contain"
      />
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <AccountListItem
            account={item}
            style={styles.listItem}
            onCheck={() => _handleCheckAccount(index)}
            onPress={() => _handlePressAccount(index)}
            checked={index === activeAccountIndex}
          />
        )}
      />
      <KButton
        title={'Create new account'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
        onPress={_handleCreateAccount}
      /> 
      <KButton
        title={'Connect account'}
        theme={'blue'}
        style={styles.button}
        onPress={() => navigate('ConnectAccount')}
        renderIcon={() => (
          <Image
            source={require('../../../assets/icons/accounts.png')}
            style={styles.buttonIcon}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default connectAccounts()(AccountsScreen);
