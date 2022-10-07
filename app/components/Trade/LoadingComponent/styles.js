import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import Colors from '../../../constant/colors';
import { height, verticalScale } from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    container: {
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapper: {
      marginBottom: 5,
      width: scale(100),
      height: 40,
      left: -10,
    },
    text: {
      textAlign: 'center',
      color: Colors[theme].text.primary,
      ...font({
        size: 12,
        height: 16,
        weight: '600',
      }),
    },
  });

export default styles;
