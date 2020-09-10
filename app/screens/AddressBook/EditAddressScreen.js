import React, { useState } from 'react';
import { Image,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KButton, KHeader, KText } from '../../components';
import styles from './AddressBookScreen.style';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger'
import { PRIMARY_BLUE } from '../../theme/colors';


const EditAddressScreen = props => {
  const {
    addAddress,
    deleteAddress,
    accountsState: { accounts, activeAccountIndex, addresses },
    navigation: { navigate },
    route: {
      params: {
        fioAddress,
        index,
      },
    },
  } = props;

  const [newName, setNewName] = useState(fioAddress.name);

  const _handleBack = () => {
    navigate('AddressBook');
  };

  const _handleEditAddress = () => {
    let newAddress = { name: newName, address: fioAddress.address, actor: fioAddress.actor, publicKey: fioAddress.publicKey };
    console.log(newAddress);
    deleteAddress(index);
    addAddress(newAddress);
    _handleBack();
  };

  const _handleDeleteAddress = () => {
    deleteAddress(index);
    _handleBack();
  };

  return (
     <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={_handleBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={24}
            color={PRIMARY_BLUE}
            />
        </TouchableOpacity>
        <KHeader title={'Edit FIO Address'} style={styles.header} />
        <KInput
          label={'FIO Address'}
          value={fioAddress.address}
          editable={false}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'} />
        <KInput
          label={'Name'}
          value={newName}
          onChangeText={setNewName}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'} />
        <KButton
          title={'Save'}
          theme={'brown'}
          style={styles.button}
          onPress={_handleEditAddress}
          icon={'edit'} />
        <KButton
          title={'Delete'}
          style={styles.button}
          onPress={_handleDeleteAddress}
          icon={'delete'} />
      </View>
    </SafeAreaView>
    );

};

export default connectAccounts()(EditAddressScreen);
