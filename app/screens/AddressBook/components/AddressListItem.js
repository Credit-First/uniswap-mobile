import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { KText } from '../../../components';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const _blank = () => {};


const AddressListItem = ({ address, onPress, ...props }) => {

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <View style={styles.contentContainer}>
            <KText style={styles.address}>{address.address}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 6,
    elevation: 4,
    backgroundColor: '#F1F6FF',
    padding: 5,
  },
  contentContainer: {
    marginLeft: 20,
  },
  address: {
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
});

export default AddressListItem;
