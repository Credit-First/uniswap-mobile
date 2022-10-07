import React from 'react';
import { View } from '../Themed';
import useThemedStyles from '../../../hooks/useThemedStyles';
import stylesMain from './styles';

const Divider = ({ customStyles }) => {
  const styles = useThemedStyles(stylesMain);

  return <View style={[styles.divider, customStyles]} />;
};
export default Divider;
