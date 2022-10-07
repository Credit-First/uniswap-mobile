import { StyleSheet } from 'react-native';

import Colors from '../../../../constants/Colors';
import font from '../../../../helpers/font';
import { theme } from '../../../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
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
            bottom: -20,
            textAlign: 'center',
            color: Colors[theme].text.primary,
            ...font({
                size: 11,
                height: 16,
                weight: '600',
            }),
        },
    });

export default styles;
