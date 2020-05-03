import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';

import { KText } from '../../../components';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const AccountListItem = ({ account, onPress, onCheck, checked, ...props }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, props.style]}>
        <CheckBox
          value={true}
          disabled={false}
          onClick={onCheck}
          isChecked={checked}
          checkBoxColor={PRIMARY_BLUE}
        />
        <View style={styles.contentContainer}>
          <KText style={styles.chainName}>{account.chainName}</KText>
          <KText style={styles.accountName}>{account.accountName}</KText>
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
    backgroundColor: '#FFF',
    padding: 20,
  },
  contentContainer: {
    marginLeft: 20,
  },
  chainName: {
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
  accountName: {
    fontSize: 16,
    color: PRIMARY_GRAY,
  },
});

export default AccountListItem;
