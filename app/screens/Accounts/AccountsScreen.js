import React from 'react';
import { View, FlatList } from 'react-native';

import { Button } from '../../components';
import styles from './AccountsScreen.style';

const AccountsScreen = props => {
  return (
    <View style={styles.container}>
      <FlatList data={[]} />
      <Button title={'Connect'} theme={'primary'} style={styles.button} />
      <Button title={'Connect'} theme={'brown'} style={styles.button} />
      <Button title={'Connect'} theme={'gray'} style={styles.button} />
    </View>
  );
};

export default AccountsScreen;
