import React from 'react';
import { Text, StyleSheet } from 'react-native';

const KText = props => {
  return <Text {...props} style={[styles.default, props.style]} />;
};

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Nunito-Bold',
  },
});

export default KText;
