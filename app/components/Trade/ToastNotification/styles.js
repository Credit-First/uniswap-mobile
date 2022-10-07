import { StyleSheet } from 'react-native';

import Colors from '../../../constant/colors';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    container: {},
    text1: {
      ...font({
        size: 15,
        weight: '700',
      }),
      color: Colors[theme].text.primary,
    },
    text2: {
      ...font({
        size: 12,
      }),
      color: Colors[theme].text.secondary,
    },
    success: {
      borderLeftColor: Colors[theme].text.accent,
    },
    error: {
      borderLeftColor: Colors[theme].text.critical,
    },
    warning: {
      borderLeftColor: Colors[theme].text.warning,
    },
    info: {
      borderLeftColor: Colors[theme].text.secondary,
    },
  });

export default styles;
