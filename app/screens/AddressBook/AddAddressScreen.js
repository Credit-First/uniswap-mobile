import React, { useState } from 'react';
import { Image, View, FlatList, TouchableOpacity, SafeAreaView, Linking, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KButton, KHeader } from '../../components';
import styles from './AddressBookScreen.style';
import { connectAddresses } from '../../redux';
import { log } from '../../logger/logger'
import { PRIMARY_BLUE } from '../../theme/colors';


const AddAddressScreen = props => {
  const {
    addAddress,
    addressesState: { addresses },
    navigation: { navigate, goBack }
  } = props;

  const [name, setName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  console.log(addresses);

  const _handleAddAddress = (address) => {
    let addressJson = {address: newAddress, name: name}
    console.log(addressJson);
    addAddress(addressJson);
    goBack();
  }

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
        <KHeader title={'Add FIO Address'} style={styles.header} />
        <KInput
          label={'FIO Address'}
          placeholder={'name@tribe'}
          value={newAddress}
          onChangeText={setNewAddress}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'} />
        <KInput
          label={'Name'}
          placeholder={'Optional name for the address'}
          value={name}
          onChangeText={setName}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'} />
        <KButton
          title={'Save'}
          theme={'brown'}
          style={styles.button}
          onPress={_handleAddAddress}
          icon={'add'} />
      </View>
    </SafeAreaView>
    );

};

export default connectAddresses()(AddAddressScreen);
