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
import TokenListItem from './components/TokenListItem';
import EVMTokenListItem from './components/EVMTokenListItem';
import { findIndex } from 'lodash';
import { getTokens, getBalance } from '../../eos/tokens';
import { getEVMTokens, getEVMBalance } from '../../ethereum/tokens';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';


const getTokenList = chainName => {
  let tokenList;
  if (chainName === 'ETH' || chainName === 'BNB' || chainName === 'MATIC') {
    tokenList = getEVMTokens(chainName);
  }
  else {
    tokenList = getTokens(chainName);
  }

  return tokenList;
}


const TokensScreen = props => {
  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: account },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const tokens = getTokenList(account.chainName);

  const _handlePressToken = index => {
    let token = tokens[index];
    navigate('TokenDetails', { account, token });
  };

  const _handlePressERC20Token = index => {
    let token = tokens[index];
    navigate('ERC20TokenDetails', { account, token });
  };

  const getTitle = () => {
    let title;
    if (account.chainName === 'ETH' || account.chainName === 'BNB' || account.chainName === 'MATIC') {
      title = account.chainName + ' tokens';
    }
    else {
      title = account.chainName + ':' + account.accountName + ' tokens';
    }

    return title;
  };

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
        <KHeader title={getTitle()} style={styles.header} />
        <FlatList
          data={tokens}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            account.chainName === 'ETH' || account.chainName === 'BNB' || account.chainName === 'MATIC' ?
              <EVMTokenListItem
                account={account}
                token={item}
                style={styles.listItem}
                onPress={() => _handlePressERC20Token(index)}
              />
              :
              <TokenListItem
                account={account}
                token={item}
                style={styles.listItem}
                onPress={() => _handlePressToken(index)}
                showAllTokens={config.showAllTokens}
              />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TokensScreen);
