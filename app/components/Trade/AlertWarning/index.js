import * as React from 'react';
import { ViewStyle } from 'react-native';

import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text, View } from '../Themed';
import stylesMain from './styles';

const AlertWarning = ({ text, containerStyle, contentStyle, children }) => {
  const styles = useThemedStyles(stylesMain);
  return (
    <View style={[styles.warningContainer, containerStyle]}>
      <View style={[styles.warningChildren, contentStyle]}>{children}</View>
      {typeof text === 'string' && (
        <Text style={styles.warningText}>{text}</Text>
      )}
    </View>
  );
};

export default AlertWarning;
