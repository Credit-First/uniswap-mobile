import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import CheckBox from 'react-native-check-box';
import { KHeader, KText } from '../../../components';
import { getChain, getEndpoint } from '../../../eos/chains';
import { getBalance } from '../../../eos/tokens';
import { getAccount } from '../../../eos/eos';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const { height, width } = Dimensions.get('window');
var transWidth = width - 40;

const TransactionListItem = ({ transaction, onPress, ...props }) => {
  return (
    <View style={styles.rowContainer}>
      <View style={[styles.container, props.style]}>
        <TouchableOpacity onPress={onPress}>
          <KText style={styles.transaction}>
            {transaction.from} -&gt; {transaction.to} : {transaction.quantity}
          </KText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  transaction: {
    width: transWidth,
    marginTop: Platform.OS === 'ios' ? 12 : 0,
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    lineHeight: 22,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default TransactionListItem;
