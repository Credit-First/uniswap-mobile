import { StyleSheet } from 'react-native';

import Colors from '../../../constant/colors';
import { scale, verticalScale } from '../../../helpers/dimensions';
import font from '../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      borderWidth: 1,
      borderColor: Colors[theme].border.primary,
      borderRadius: 1000,
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      color: Colors[theme].text.primary,
      ...font({
        size: 15,
        height: 22,
        weight: '400',
      }),
      letterSpacing: 0.16,
      marginRight: verticalScale(12),
    },
  });

export default styles;
