import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Image,
  View,
  FlatList,
  SafeAreaView,
  Linking,
  Text,
  Alert } from 'react-native';
import { KButton, KHeader } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import TokenListItem from './components/TokenListItem';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger'


const TokensScreen = props => {
  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts },
  } = props;

  const tokens = account.tokens;

  const _handlePressToken = index => {
    let token = tokens[index];
    navigate('TokenDetails', { account, token });
  };

  const getTitle = () => {
    return account.chainName + ':' + account.accountName + ' tokens';
  };


  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.inner}>
     <KHeader title={getTitle()} style={styles.header} />
     <FlatList
       data={tokens.sort((a, b) => a.name.localeCompare(b.name))}
       keyExtractor={(item, index) => `${index}`}
       renderItem={({ item, index }) => (
         <TokenListItem
           account={account}
           token={item}
           style={styles.listItem}
           onPress={() => _handlePressToken(index)}
         />
       )}
     />
    </View>
  </SafeAreaView>
  );

};

export default connectAccounts()(TokensScreen);
