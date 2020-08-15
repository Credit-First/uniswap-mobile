import React, { useState } from 'react';
import { Image, View, FlatList, TouchableOpacity, SafeAreaView, Linking, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KButton, KHeader } from '../../components';
import styles from './AddressBookScreen.style';
import { connectAddresses } from '../../redux';
import { log } from '../../logger/logger'
import { PRIMARY_BLUE } from '../../theme/colors';
import BubbleSelect, { Bubble } from 'react-native-bubble-select';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const AddressBookScreen = props => {
  const {
    navigation: { navigate, goBack },
    addressesState: { addresses },
  } = props;

  console.log(addresses);

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.inner}>
     <KHeader title={'Address Book'} style={styles.header} />
       <BubbleSelect
        onSelect={bubble => console.log('Selected: ', bubble.id)}
        onDeselect={bubble => console.log('Deselected: ', bubble.id)}
        width={width}
        height={height}>
        {addresses.map(address => (
        <Bubble
          key={address.address}
          id={address.address}
          text={address.address}
          color={'grey'}
          selectedColor={'orange'}
        />
      ))}
      </BubbleSelect>
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

export default connectAddresses()(AddressBookScreen);
