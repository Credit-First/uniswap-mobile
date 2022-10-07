import * as React from 'react';
import { Animated, Text, View } from 'react-native';

import { useLottieAssets } from '../../../../contexts/LottieAssetsContext';
import useThemedStyles from '../../../../hooks/useThemedStyles';
import ImageSequences from '../../../ImageSequences';
import mainStyles from './styles';

interface IProps {
    isRefreshing?: boolean;
    textLoading?: string;
    children?: React.ReactNode;
}

const DefaultHeaderComponent: React.FC<IProps> = ({
    isRefreshing,
    textLoading,
    children,
}) => {
    const styles = useThemedStyles(mainStyles);

    const { runningAsset } = useLottieAssets();

    const [fadeAnim] = React.useState(new Animated.Value(0));
    React.useEffect(() => {
        if (isRefreshing) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }, [isRefreshing]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.imageContainer, { opacity: fadeAnim }]}>
                <View style={styles.image}>
                    {runningAsset && (
                        <ImageSequences
                            isPlaying={isRefreshing}
                            source={runningAsset}
                        />
                    )}
                </View>
                <Text style={styles.text}>{textLoading}</Text>
            </Animated.View>
            {children}
        </View>
    );
};

export default DefaultHeaderComponent;
