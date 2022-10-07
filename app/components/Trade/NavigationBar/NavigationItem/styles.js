import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';
import { verticalScale } from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(2),
      paddingHorizontal: verticalScale(8),
      borderRadius: 1000,
      borderWidth: 1,
      borderColor: Colors[theme].background,
      justifyContent: 'center',
    },
    isActive: {
      borderColor: Colors[theme].border.accent,
      color: Colors[theme].text.accent,
    },
    text: {
      color: Colors[theme].text.secondary,
      ...font({
        size: 14,
        height: 20,
        weight: '700',
      }),
    },
  });

export default styles;
