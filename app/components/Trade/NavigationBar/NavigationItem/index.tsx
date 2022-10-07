import * as React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text } from '../../Themed';
import stylesMain from './styles';

interface IProps extends PressableProps {
    containerStyles?: StyleProp<ViewStyle>;
    isActive?: boolean;
    title: string;
}

const NavigationItem = ({
    containerStyles,
    isActive = false,
    title,
    ...props
}: IProps) => {
    const styles = useThemedStyles(stylesMain);

    return (
        <Pressable
            {...props}
            style={[
                styles.container,
                isActive && styles.isActive,
                containerStyles,
            ]}>
            <Text style={[styles.text, isActive && styles.isActive]}>
                {title}
            </Text>
        </Pressable>
    );
};
export default NavigationItem;
