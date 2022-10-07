import * as React from 'react';

import useThemedStyles from '../../../hooks/useThemedStyles';
import CopyToClipboardButton from '../CopyToClipboardButton';
import { Text, View } from '../Themed';
import stylesMain from './styles';

const WalletAddress = ({ address }) => {
  const styles = useThemedStyles(stylesMain);

  const editAddress = React.useMemo(
    () => `${address.slice(0, 9)}...${address.slice(address.length - 13)}`,
    [address],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{editAddress}</Text>
      <CopyToClipboardButton address={address} />
    </View>
  );
};
export default WalletAddress;
