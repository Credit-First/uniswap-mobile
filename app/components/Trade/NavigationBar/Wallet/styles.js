import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';
import { scale, verticalScale } from '../../../helpers/dimensions';
import font from '../../../helpers/font';

const styles = theme =>
  StyleSheet.create({
    coinWrapper: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    text: {
      color: Colors[theme].text.primary,
      ...font({
        size: 12,
        height: 16,
        weight: '600',
      }),
      marginLeft: scale(4),
    },
    itemGap: {
      marginRight: scale(8),
    },
    itemPadding: {
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(6),
    },
    energyWrapper: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    gap: {
      marginRight: verticalScale(6),
    },
    coinsWrapper: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
    },
    icon: {
      width: 20,
      height: 20,
    },
  });

export default styles;
