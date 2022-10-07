import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { moderateScale, scale, verticalScale } from '../../helpers/dimensions';
import font from '../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    button: {
      borderRadius: moderateScale(46),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      position: 'relative',
    },
    buttonText: {
      color: Colors[theme].buttonText,
    },
    buttonFilled: {
      backgroundColor: Colors[theme].buttonBackground,
      borderColor: Colors[theme].buttonBackground,
    },
    buttonFilledPressed: {
      backgroundColor: Colors[theme].buttonBackgroundPress,
      borderColor: Colors[theme].buttonBackgroundPress,
    },
    buttonFilledShadow: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadow,
    },
    buttonOutlined: {
      backgroundColor: Colors[theme].buttonBackgroundOutline,
      borderColor: Colors[theme].buttonBorderOutline,
    },
    buttonOutlinedPressed: {
      backgroundColor: Colors[theme].buttonBackgroundPressOutline,
    },
    buttonOutlinedShadow: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadowOutline,
    },
    buttonCritical: {
      backgroundColor: Colors[theme].buttonBackgroundCritical,
      borderColor: Colors[theme].buttonBorderCritical,
    },
    buttonCriticalPressed: {
      backgroundColor: Colors[theme].buttonBackgroundPressCritical,
    },
    buttonCriticalShadow: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadowCritical,
    },

    buttonTexted: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    buttonTextedText: {
      color: Colors[theme].buttonTextTexted,
    },
    buttonTextedPressed: {},
    buttonTextedTextPressed: {
      color: Colors[theme].buttonTextTextedPress,
    },
    buttonTextedTextDisabled: {
      color: Colors[theme].buttonTextTextedDisabled,
    },

    buttonFilledDisabled: {
      backgroundColor: Colors[theme].buttonBackgroundDisabled,
      borderColor: Colors[theme].buttonBackgroundDisabled,
    },
    buttonFilledShadowDisabled: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadowDisabled,
    },
    buttonOutlinedDisabled: {
      backgroundColor: Colors[theme].buttonBackgroundOutlineDisabled,
      borderColor: Colors[theme].buttonBorderOutline,
    },
    buttonOutlinedShadowDisabled: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadowDisabledOutline,
    },
    buttonCriticalDisabled: {
      backgroundColor: Colors[theme].buttonBackgroundCriticalDisabled,
      borderColor: Colors[theme].buttonBackgroundCriticalDisabled,
    },
    buttonCriticalShadowDisabled: {
      borderRadius: 1000,
      backgroundColor: Colors[theme].buttonShadowDisabledCritical,
    },
    buttonTextDisabled: {
      color: Colors[theme].buttonTextDisabled,
    },
    buttonLg: {
      paddingVertical: verticalScale(11),
      paddingHorizontal: scale(24),
      marginBottom: verticalScale(4),
    },
    buttonMd: {
      paddingVertical: verticalScale(7),
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(3),
    },
    buttonSm: {
      paddingVertical: verticalScale(3),
      paddingHorizontal: scale(12),
      marginBottom: verticalScale(2),
    },
    buttonIcon: {
      marginRight: 0,
    },
    buttonIconLg: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      minWidth: scale(44),
      minHeight: scale(44),
    },
    buttonIconMd: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      minWidth: scale(32),
      minHeight: scale(32),
    },
    buttonIconSm: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      minWidth: scale(24),
      minHeight: scale(24),
    },
    buttonTextLg: {
      ...font({
        size: 16,
        height: 22,
        weight: '700',
      }),
    },
    buttonTextMd: {
      ...font({
        size: 14,
        height: 20,
        weight: '700',
      }),
    },
    buttonTextSm: {
      ...font({
        size: 12,
        height: 16,
        weight: '700',
      }),
    },
    icon: {
      marginRight: scale(8),
      backgroundColor: 'transparent',
    },
    iconSocial: {
      position: 'absolute',
      left: scale(18),
    },
  });

export default styles;
