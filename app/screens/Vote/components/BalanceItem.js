import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KText } from '../../../components';
import { PRIMARY_GRAY, PRIMARY_BLUE } from '../../../theme/colors';

const BalanceItem = ({ label, value, ...props }) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      <KText style={styles.labelText} numberOfLines={1}>
        {label}
      </KText>
      <KText style={styles.valueText} numberOfLines={1}>
        {value}
      </KText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 6,
    elevation: 4,
    marginHorizontal: 6,
    padding: 12,
  },
  labelText: {
    fontSize: 14,
    color: PRIMARY_GRAY,
  },
  valueText: {
    marginTop: 4,
    color: PRIMARY_BLUE,
    fontSize: 18,
  },
});

export default BalanceItem;
