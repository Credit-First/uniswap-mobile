import React from 'react';
import { View, StyleSheet } from 'react-native';
import KText from './KText';

const KHeader = ({ title, subTitle, ...props }) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      <KText style={styles.title}>{title}</KText>
      <KText style={styles.subTitle}>{subTitle}</KText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 24,
    color: '#273D52',
  },
  subTitle: {
    fontSize: 15,
    color: '#ADADBD',
  },
});

export default KHeader;
