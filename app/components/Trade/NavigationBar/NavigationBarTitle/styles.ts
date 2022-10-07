import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';
import { verticalScale } from '../../../helpers/dimensions';
import font from '../../../helpers/font';
import { theme } from '../../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        title: {
            color: Colors[theme].text.primary,
            ...font({
                size: 16,
                height: 24,
                weight: '700',
            }),
        },
        titleWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'transparent',
        },
    });

export default styles;
