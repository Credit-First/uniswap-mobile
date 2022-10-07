import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';

import font from '../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    title: {
      color: Colors[theme].text.primary,
      ...font({
        size: 16,
        height: 24,
        weight: '700',
      }),
    },
    titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: 'transparent',
    },
  });

export default styles;
