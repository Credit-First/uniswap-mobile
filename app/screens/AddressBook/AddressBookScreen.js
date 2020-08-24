import React, { useState } from 'react';
import { Image, View, FlatList, TouchableOpacity, SafeAreaView, Linking, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KButton, KHeader } from '../../components';
import AddressListItem from './components/AddressListItem';
import styles from './AddressBookScreen.style';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger'
import { PRIMARY_BLUE } from '../../theme/colors';


const AddressBookScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, activeAccountIndex, addresses },
  } = props;

  const [toAccount, setToAccount] = useState();

  const _handlePressAddress = (index) => {
    let fioAddress = addresses[index];
    navigate('FIOChat', { fioAddress });
  }

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.inner}>
     <KHeader title={'Address Book'} style={styles.header} />
     <FlatList
       data={addresses}
       keyExtractor={(item, index) => `${index}`}
       renderItem={({ item, index }) => (
         <AddressListItem
           address={item}
           style={styles.listItem}
           onPress={() => _handlePressAddress(index)}
         />
       )}
     />
      <KButton
        title={'Add address'}
        theme={'brown'}
        style={styles.button}
        onPress={() => navigate('AddAddress')}
        icon={'add'}
      />
    </View>
  </SafeAreaView>
  );

};

export default connectAccounts()(AddressBookScreen);
