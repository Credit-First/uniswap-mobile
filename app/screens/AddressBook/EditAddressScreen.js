import React, { useState } from 'react';
import {
  Image,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KButton, KHeader, KText, TwoIconsButtons } from '../../components';
import styles from './AddressBookScreen.style';
import { connectAccounts } from '../../redux';
import { log } from '../../logger/logger';
import { PRIMARY_BLUE } from '../../theme/colors';

const EditAddressScreen = props => {
  const {
    addAddress,
    deleteAddress,
    accountsState: { accounts, addresses, keys, totals, history, config },
    navigation: { navigate },
    route: {
      params: { fioAddress, index },
    },
  } = props;

  const [newName, setNewName] = useState(fioAddress.name);

  const _handleBack = () => {
    navigate('AddressBook');
  };

  const _handleEditAddress = () => {
    let newAddress = {
      name: newName,
      address: fioAddress.address,
      actor: fioAddress.actor,
      publicKey: fioAddress.publicKey,
    };
    //console.log(newAddress);
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
          autoCapitalize={'none'}
        />
        <KInput
          label={'Name'}
          value={newName}
          onChangeText={setNewName}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <TwoIconsButtons
          onIcon1Press={_handleEditAddress}
          onIcon2Press={_handleDeleteAddress}
          icon1={() => (
            <Image
              source={require('../../../assets/icons/save_key.png')}
              style={styles.buttonIcon}
            />
          )}
          icon2={() => (
            <Image
              source={require('../../../assets/icons/delete.png')}
              style={styles.buttonIcon}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(EditAddressScreen);
