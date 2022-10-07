import { Dimensions } from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from 'react-native-size-matters/extend';

const SIZE_MATTERS_BASE_WIDTH = 375;

export const { width, height } = Dimensions.get('window');
export const isSmallLayout = +width <= +SIZE_MATTERS_BASE_WIDTH;

export { scale, verticalScale, moderateScale };
