import { StyleSheet } from 'react-native';

import { verticalScale } from '../../helpers/dimensions';
import { theme } from '../../types';

const styles = (theme: theme) =>
    StyleSheet.create({
        transactionDetails: {
            marginBottom: verticalScale(16),
        },
        warning: {
            marginBottom: verticalScale(16),
        },
        buttonContainer: {},
        button: {
            marginBottom: verticalScale(16),
        },
    });

export default styles;
