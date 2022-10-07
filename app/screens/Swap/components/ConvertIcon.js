/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_BLUE } from '../../../theme/colors';
const ConverIcon = props => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.05,
        position: 'relative',
      }}>
      <View
        style={{
          position: 'absolute',
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: 50,
          borderWidth: 8,
          borderColor: '#f8f9ec',
          textAlign: 'center',
        }}>
        <MaterialIcon name={'south'} size={30} color={PRIMARY_BLUE} />
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   tokenInOut: {
//     backgroundColor: 'white',
//     flex: 0.5,
//     borderRadius: 15,
//     // margin: 1,
//     justifyContent: 'center',
//   },
// });

export default ConverIcon;
