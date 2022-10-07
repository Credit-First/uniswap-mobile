import { StyleSheet } from 'react-native';

import Colors from '../../../constant/colors';

const styles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme].background,
      flex: 1,
    },
    flatlist: {
      backgroundColor: Colors[theme].background,
    },
  });

export default styles;
