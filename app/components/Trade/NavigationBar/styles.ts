import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { scale, verticalScale } from '../../helpers/dimensions';
import font from '../../helpers/font';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        singleButton: {
            paddingHorizontal: scale(8),
            paddingVertical: verticalScale(8),
        },
        container: {
            paddingHorizontal: scale(16),
            paddingBottom: verticalScale(16),
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10000,
        },
        spaceBetween: {
            justifyContent: 'space-between',
        },
        containerFilled: {
            backgroundColor: Colors[theme].navigationBar.background,
        },
        buttonWrapper: {
            backgroundColor: 'transparent',
        },
        withChildren: {
            backgroundColor: Colors[theme].background,
        },
        buttonWrapperChildren: {
            backgroundColor: 'transparent',
        },
        emptyIcon: {
            width: verticalScale(32),
        },
        avatar: {
            width: 35,
        },
        role: {
            width: 20,
        },
        roleWrapper: {
            position: 'absolute',
            bottom: '-5%',
            right: '-5%',
            backgroundColor: 'transparent',
        },
    });

export default styles;
