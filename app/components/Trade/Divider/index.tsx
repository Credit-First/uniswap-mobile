import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { View } from '../../components/Themed';
import useThemedStyles from '../../hooks/useThemedStyles';
import stylesMain from './styles';

interface IProps {
    customStyles?: StyleProp<ViewStyle>;
}

const Divider = ({ customStyles }: IProps) => {
    const styles = useThemedStyles(stylesMain);

    return <View style={[styles.divider, customStyles]}></View>;
};
export default Divider;
