import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import ArrowDownIcon from '../../../../assets/icons/buttons/arrowDown.svg';
import ArrowUpIcon from '../../../../assets/icons/buttons/arrowUp.svg';
import useThemedStyles from '../../../../hooks/useThemedStyles';
import { Text } from '../../../Themed';
import mainStyles from './styles.js';

const PullToRefreshArrow = ({
  isRefreshing,
  offsetY,
  refreshingHeight,
  textReleasing,
  textPulling,
}) => {
  const styles = useThemedStyles(mainStyles);

  const [arrowType, setArrowType] = React.useState(false);

  const textPullToRefreshDownText = arrowType ? textReleasing : textPulling;

  const offset = useSharedValue(0);

  React.useEffect(() => {
    function update() {
      if (offsetY <= -refreshingHeight) {
        setArrowType(true);
      } else {
        setArrowType(false);
      }
    }
    update();
    offset.value = offsetY;
  }, [offsetY]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -offset.value * 0.02 }],
    };
  });

  return !isRefreshing ? (
    <Animated.View style={[styles.arrowIcon, animatedStyles.transform]}>
      {arrowType ? <ArrowUpIcon /> : <ArrowDownIcon />}
      <Text style={styles.text}>{textPullToRefreshDownText}</Text>
    </Animated.View>
  ) : (
    <></>
  );
};

export default PullToRefreshArrow;
