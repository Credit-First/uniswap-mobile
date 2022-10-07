import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { useLottieAssets } from '../../../contexts/LottieAssetsContext';
import useThemedStyles from '../../../hooks/useThemedStyles';
import ImageSequences from '../ImageSequences';
import { Text, View } from '../Themed';
import stylesMain from './styles';

const LoadingComponent = ({
  text = 'loading',
  containerStyles,
  imageStyles,
}) => {
  const styles = useThemedStyles(stylesMain);
  const { runningAsset } = useLottieAssets();

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={[styles.iconWrapper, imageStyles]}>
        {runningAsset && <ImageSequences source={runningAsset} />}
      </View>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};
export default LoadingComponent;
