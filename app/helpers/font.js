// import { SIZE_MATTERS_BASE_WIDTH } from '@env';
import { PixelRatio, Platform, TextStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const isAndroidDevices = true;
const dpi = PixelRatio.get();
const SIZE_MATTERS_BASE_WIDTH = 375;

const fontWeight = weight => {
  const weights = ['500', '600', '700', '800'];
  const fontFamily = {
    '400': 'Nunito-Regular',
    '500': 'Nunito-Medium',
    '600': 'Nunito-SemiBold',
    '700': 'Nunito-Bold',
    '800': 'Nunito-ExtraBold',
  };

  if (weight && weights.includes(weight)) {
    return Platform.select({
      ios: {
        fontFamily: fontFamily[weight],
      },
      android: {
        fontFamily: fontFamily[weight],
      },
    });
  }

  return Platform.select({
    default: { fontWeight: weight },
  });
};

const fontSize = size =>
  // all size values are referred to DPI = 1, for dpi diffent from 1, we should scale/downscale the current size,
  // isAndroidDevices true
  isAndroidDevices
    ? size
    : RFValue(size / (dpi >= 3 ? 2 : dpi), Number(SIZE_MATTERS_BASE_WIDTH));

export const MAIN_FONT = 'Nunito-Regular';

export default function font({
  size = fontSize(14),
  height = fontSize(20),
  weight = '400',
  style = 'normal',
  family = MAIN_FONT,
}) {
  return {
    fontFamily: family,
    ...fontWeight(weight),
    fontSize: fontSize(size),
    fontStyle: style,
    ...(height !== null
      ? {
          lineHeight: fontSize(height),
        }
      : {}),
  };
}
