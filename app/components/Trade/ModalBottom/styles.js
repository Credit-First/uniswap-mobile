import { Dimensions, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import Colors from '../../../constant/colors';
import { moderateScale, verticalScale } from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const { width: screenWidth } = Dimensions.get('window');

const styles = theme =>
  StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
    },
    modalView: {
      width: screenWidth,
    },
    centeredView: {
      alignItems: 'center',
      marginTop: 'auto',
    },
    container: {
      backgroundColor: Colors[theme].modal.background,
      flex: 1,
      borderTopRightRadius: moderateScale(20),
      borderTopLeftRadius: moderateScale(20),
    },
    lineWrapper: {
      height: 40,
      width: screenWidth,
    },
    line: {
      height: 4,
      width: 56,
      backgroundColor: Colors[theme].modalLine,
      borderRadius: 1000,
      position: 'absolute',
      bottom: 8,
      left: screenWidth / 2 - 28,
    },
    contentContainer: {
      height: '100%',
      paddingVertical: verticalScale(16),
      paddingHorizontal: verticalScale(20),
    },
    titleContainer: {
      selfAlign: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: verticalScale(16),
    },
    titleText: {
      color: Colors[theme].text.primary,
      ...font({
        size: 14,
        height: 20,
        weight: '700',
      }),
    },
    additionalTextContainer: {
      marginBottom: verticalScale(16),
    },
    additionalText: {
      color: Colors[theme].text.secondary,
      ...font({
        size: 15,
        height: 22,
        weight: '400',
      }),
      letterSpacing: 0.16,
    },
  });

export default styles;
