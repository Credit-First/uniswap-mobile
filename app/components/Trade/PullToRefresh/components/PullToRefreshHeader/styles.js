import { StyleSheet } from 'react-native';

import Colors from '../../../../../constant/colors';
import { scale, verticalScale } from '../../../../../helpers/dimensions';
import font from '../../../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    container: {},
    imageContainer: {
      paddingHorizontal: scale(16),
      position: 'absolute',
      marginTop: 10,
      left: 0,
      right: 0,
    },
    image: {
      height: 40,
      left: -10,
    },
    arrowIcon: {
      position: 'absolute',
      alignItems: 'center',
      top: -50,
      left: 0,
      right: 0,
    },
    text: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: verticalScale(-20),
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
