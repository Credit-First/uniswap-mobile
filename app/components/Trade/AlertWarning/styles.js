import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const stylesMain = theme =>
  StyleSheet.create({
    warningContainer: {
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(12),
      backgroundColor: Colors[theme].backgroundWarning,
      borderRadius: moderateScale(8),
    },
    warningText: {
      width: '95%',
      color: Colors[theme].text.warning,
      ...font({
        size: 13,
        height: 18,
        weight: '400',
      }),
    },
    warningChildren: {
      backgroundColor: 'transparent',
    },
    gap: {
      marginTop: verticalScale(8),
    },
  });

export default stylesMain;
