import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import font from '../../helpers/font';
import { theme } from '../../types';

const styles = (theme: theme) =>
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
