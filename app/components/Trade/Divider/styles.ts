import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        divider: {
            backgroundColor: Colors[theme].divider,
            height: 1,
        },
    });

export default styles;
