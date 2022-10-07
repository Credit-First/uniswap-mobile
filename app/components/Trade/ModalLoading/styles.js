import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { moderateScale, scale, verticalScale } from '../../helpers/dimensions';

const styles = theme =>
  StyleSheet.create({
    modal: {
      alignItems: 'center',
    },
    shadow: {
      top: verticalScale(-24),
      borderRadius: moderateScale(12),
      backgroundColor: Colors[theme].modal.shadowColor,
      maxWidth: scale(240),
    },
    container: {
      backgroundColor: Colors[theme].modal.background,
      borderRadius: moderateScale(12),
      marginBottom: verticalScale(4),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(12),
      borderWidth: 1,
      borderColor: Colors[theme].borderColor,
      alignItems: 'center',
      maxWidth: scale(200),
    },
    iconWrapper: {
      height: verticalScale(70),
    },
  });

export default styles;
