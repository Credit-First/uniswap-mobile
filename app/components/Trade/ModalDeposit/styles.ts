import { StyleSheet } from 'react-native';

import { verticalScale } from '../../helpers/dimensions';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        topWrapper: {
            alignItems: 'center',
        },
        walletAddressWrapper: { marginVertical: verticalScale(20) },
    });

export default styles;
