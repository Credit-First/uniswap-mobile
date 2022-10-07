import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { scale, verticalScale } from '../../helpers/dimensions';
import font from '../../helpers/font';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        textWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        keyText: {
            alignSelf: 'baseline',
            width: '40%',
            color: Colors[theme].text.secondary,
            ...font({
                size: 14,
                weight: '400',
            }),
            letterSpacing: 0.16,
        },
        valueText: {
            flex: 1,
            flexWrap: 'wrap',
            textAlign: 'right',
            color: Colors[theme].text.primary,
            ...font({
                size: 14,
                height: 22,
                weight: '600',
            }),
        },
        valueComponent: {
            flex: 1,
            alignItems: 'flex-end',
        },
        gap: {
            marginBottom: verticalScale(12),
        },
    });

export default styles;
