import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import useThemedStyles from '../../../hooks/useThemedStyles';
import Button from '../Button';
import { View } from '../Themed';
import stylesMain from './styles';

const ButtonsBottom = ({
  title,
  onPress,
  disabled,
  containerStyle,
  children,
}) => {
  const styles = useThemedStyles(stylesMain);

  return (
    <View style={[styles.buttonWrapper, containerStyle]}>
      <Button onPress={onPress} title={title} disabled={disabled} />
      {!!children && children}
    </View>
  );
};
export default ButtonsBottom;
