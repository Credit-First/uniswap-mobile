import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import styles from './NFTScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_BLUE } from '../../theme/colors';

const NFTScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader title={'Crypto Tribe NFT'} style={styles.header} />
      </View>
    </SafeAreaView>
  );

};

export default connectAccounts()(NFTScreen);
