import React from 'react';
import { View, Image, FlatList, Linking } from 'react-native';

import { KButton } from '../../components';
import styles from './AccountsScreen.style';

const AccountsScreen = ({ navigation }) => {
  const { navigate } = navigation;

  const _handleCreateAccount = () => {
    Linking.openURL('https://eostribe.io/newaccount/index.html');
  };

  return (
    <View style={styles.container}>
      <FlatList data={[]} />
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
    </View>
  );
};

export default AccountsScreen;
