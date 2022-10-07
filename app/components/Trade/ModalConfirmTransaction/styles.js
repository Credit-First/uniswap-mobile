import { StyleSheet } from 'react-native';

import { verticalScale } from '../../helpers/dimensions';

const styles = theme =>
  StyleSheet.create({
    transactionDetails: {
      marginBottom: verticalScale(16),
    },
    warning: {
      marginBottom: verticalScale(16),
    },
    buttonContainer: {},
    button: {
      marginBottom: verticalScale(16),
    },
  });

export default styles;
