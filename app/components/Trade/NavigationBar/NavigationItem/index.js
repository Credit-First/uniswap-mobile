import * as React from 'react';
import { Pressable } from 'react-native';

import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text } from '../../Themed';
import stylesMain from './styles';

const NavigationItem = ({
  containerStyles,
  isActive = false,
  title,
  ...props
}) => {
  const styles = useThemedStyles(stylesMain);

  return (
    <Pressable
      {...props}
      style={[styles.container, isActive && styles.isActive, containerStyles]}>
      <Text style={[styles.text, isActive && styles.isActive]}>{title}</Text>
    </Pressable>
  );
};
export default NavigationItem;
