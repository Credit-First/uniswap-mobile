import React from 'react';
import { View, StyleSheet } from 'react-native';
import KText from './KText';
import { PRIMARY_BLUE } from '../theme/colors';

const KLabel = ({ title, subTitle, ...props }) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      <KText style={styles.title}>{title}</KText>
      <KText style={styles.subTitle}>{subTitle}</KText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    fontSize: 15,
    color: PRIMARY_BLUE,
    marginRight: 5,
  },
  subTitle: {
    fontSize: 15,
    color: '#273D52',
  },
});

export default KLabel;
