/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

const TokenFrom = ({ style, visibleModal, title, handleAmount, balances }) => {
  const [amount, setAmount] = React.useState(0);
  return (
    <View style={style}>
      <View style={styles.view}>
        <Text>From</Text>
        <Text>Balance:{balances}$</Text>
      </View>
      <View style={styles.view}>
        <TextInput
          style={{ height: 40, width: '40%' }}
          placeholder="0.0"
          underlineColorAndroid="#59D4FC"
          onChangeText={value => {
            if (isNaN(+value)) {
              return;
            } else {
              setAmount(value);
              handleAmount(value);
            }
          }}
          value={amount}
          numberic
        />
        <TouchableOpacity onPress={visibleModal} style={styles.touchable}>
          <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  touchable: {
    backgroundColor: '#2196F3',
    padding: 7,
    borderRadius: 5,
    width: 120,
  },
});

export default TokenFrom;
