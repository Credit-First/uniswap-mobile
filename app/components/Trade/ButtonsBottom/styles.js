import { StyleSheet } from 'react-native';

import Colors from '../../../constant/colors';
import { scale, verticalScale } from '../../../helpers/dimensions';

const styles = theme =>
  StyleSheet.create({
    buttonWrapper: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      backgroundColor: Colors[theme].background,
    },
  });

export default styles;
