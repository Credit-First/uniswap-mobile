import React from 'react';
import { Image, FlatList, SafeAreaView } from 'react-native';

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

  // const _handleCreateAccount = () => {
  //   Linking.openURL('https://eostribe.io/newaccount/index.html');
  // };

  const _handleRegisterAddress = () => {
    navigate('RegisterAddress');
  };

  const _handleCheckAccount = index => {
    chooseActiveAccount(index);
  };

  const _handlePressAccount = index => {
    const account = accounts[index];
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
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
        title={'Register [address]@tribe'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
        onPress={_handleRegisterAddress}
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
