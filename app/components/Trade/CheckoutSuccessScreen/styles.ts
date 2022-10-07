import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import { scale, verticalScale } from '../../helpers/dimensions';
import font from '../../helpers/font';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: verticalScale(10),
        },
        safe: {
            flex: 1,
            backgroundColor: Colors[theme].background,
        },
        textWrapper: {
            marginTop: verticalScale(20),
            marginBottom: verticalScale(20),
            paddingHorizontal: scale(20),
        },
        title: {
            color: Colors[theme].text.primary,
            ...font({
                size: 22,
                height: 28,
                weight: '700',
            }),
            marginBottom: verticalScale(8),
        },
        text: {
            color: Colors[theme].text.secondary,
            ...font({
                size: 15,
                height: 22,
                weight: '400',
            }),
            letterSpacing: 0.16,
        },
        align: {
            textAlign: 'center',
        },
        imageWrapper: {
            alignItems: 'center',
            marginTop: verticalScale(30),
            height: 180,
        },
        transactionDetailsWrapper: {
            marginHorizontal: scale(20),
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(16),
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors[theme].borderColor,
        },
        explorerLinkContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: verticalScale(12),
        },
        additionalButton: {
            marginTop: verticalScale(16),
        },
    });

export default styles;
