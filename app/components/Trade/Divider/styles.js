import { StyleSheet } from 'react-native';

import Colors from '../../../constant/colors';

const styles = theme =>
  StyleSheet.create({
    divider: {
      backgroundColor: Colors[theme].divider,
      height: 1,
    },
  });

export default styles;
