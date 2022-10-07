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
    content: {
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(8),
      borderRadius: moderateScale(8),
      backgroundColor: Colors[theme].background,
      borderWidth: 1,
      borderColor: Colors[theme].border.primary,
    },
    contentText: {
      ...font({
        size: 13,
        height: 18,
        weight: '400',
      }),
      color: Colors[theme].text.primary,
    },
  });

export default styles;
