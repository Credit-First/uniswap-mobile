import { StyleSheet } from 'react-native';

import Colors from '../../../constants/Colors';
import { scale, verticalScale } from '../../../helpers/dimensions';
import { theme } from '../../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        shadow: {
            borderRadius: 1000,
            backgroundColor: Colors[theme].navigationBar.shadowColor,
        },
        container: {
            paddingHorizontal: scale(4),
            paddingVertical: verticalScale(3),
            backgroundColor: Colors[theme].navigationBar.elementsBackground,
            borderWidth: 1,
            borderRadius: 1000,
            marginBottom: verticalScale(3),
            borderColor: Colors[theme].navigationBar.elementsBorder,
            flexDirection: 'row',
        },
    });

export default styles;
