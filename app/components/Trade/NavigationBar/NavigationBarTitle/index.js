import * as React from 'react';

import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text, View } from '../../Themed';
import stylesMain from './styles';

const NavigationBarTitle = ({ title }) => {
  const styles = useThemedStyles(stylesMain);
  return (
    <View style={styles.titleWrapper}>
      <Text style={[styles.title]}>{title}</Text>
    </View>
  );
};

export default NavigationBarTitle;
