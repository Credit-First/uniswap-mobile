import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  Image,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KButton, KHeader } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import KeyItem from './components/KeyItem';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const KeyListScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const validKeys = keys.filter((value, index, array) => {
    accounts.map(function(account) {
      if (account.privateKey && value.private == account.privateKey) {
        value.account = account.accountName;
      }
    });
    return array.indexOf(value) === index;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={24}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <KHeader title={'List of all keys'} style={styles.header} />
        <FlatList
          data={validKeys}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <KeyItem
              publicKey={item.public}
              privateKey={item.private}
              account={item.account}
              style={styles.listItem}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(KeyListScreen);
