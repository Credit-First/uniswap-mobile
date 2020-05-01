import React from 'react';
import { View, Image, FlatList } from 'react-native';

import { KButton } from '../../components';
import styles from './AccountsScreen.style';

const AccountsScreen = props => {
  return (
    <View style={styles.container}>
      <FlatList data={[]} />
      <KButton
        title={'Create new account'}
        theme={'brown'}
        style={styles.button}
        icon={'add'}
      />
      <KButton
        title={'Connect account'}
        theme={'blue'}
        style={styles.button}
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
