import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import styles from './MenuScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_BLUE } from '../../theme/colors';

const TabMenuScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const adminAccount = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'FIO' && value.address === 'admin@tribe');
  });


  var adminButton = <View style={styles.spacer} />;
  if (adminAccount.length > 0) {
    adminButton = (
      <KButton
        title={'Admin'}
        style={styles.button}
        onPress={() => navigate('Admin')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Menu actions'} style={styles.header} />
        <View style={styles.spacer} />
        <KButton
          title={'Address book'}
          style={styles.button}
          onPress={() => navigate('AddressBook')}
        />
        <KButton
          title={'Recover Private Key'}
          style={styles.button}
          onPress={() => navigate('RecoverPrivateKey')}
        />
        <KButton
          title={'List all keys in wallet'}
          style={styles.button}
          onPress={() => navigate('KeyList')}
        />
        {adminButton}
      </View>
    </SafeAreaView>
  );

};

export default connectAccounts()(TabMenuScreen);
