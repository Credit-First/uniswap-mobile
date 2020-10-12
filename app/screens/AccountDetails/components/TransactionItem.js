import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { get } from 'lodash';
import moment from 'moment';
import { KText } from '../../../components';
import { PRIMARY_GRAY } from '../../../theme/colors';

const TransactionItem = ({ action, activeAccount, onPress }) => {
  const data = get(action, 'act.data');

  if (!data) {
    return null;
  }

  const isSent = activeAccount.accountName === data.from;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.row}>
          <KText style={styles.date}>
            {moment(action.block_timestamp).format('MMM DD, YYYY hh:mm:ss A')}
          </KText>
          <KText style={styles.amount}>{data.quantity}</KText>
        </View>
        <View style={styles.secondRow}>
          <KText style={styles.accountName}>
            {isSent ? data.to : data.from}
          </KText>
          <MaterialIcon
            name={isSent ? 'arrow-forward' : 'arrow-back'}
            color={PRIMARY_GRAY}
            size={20}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#E5E5EE',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  date: {
    fontSize: 16,
  },
  amount: {
    color: PRIMARY_GRAY,
    fontSize: 16,
  },
  accountName: {
    color: PRIMARY_GRAY,
    fontSize: 16,
  },
});

export default TransactionItem;
