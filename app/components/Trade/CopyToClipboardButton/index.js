import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

import CopyIcon from '../../assets/icons/buttons/copy.svg';
import CopyIconActive from '../../assets/icons/buttons/copyActive.svg';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text } from '../Themed';
import stylesMain from './styles';

const CopyToClipboardButton = ({ address }) => {
  const styles = useThemedStyles(stylesMain);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    setCopied(true);
  };

  React.useEffect(() => {
    if (!copied) return;
    let timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Tooltip
      backgroundColor={'transparent'}
      isVisible={copied}
      childContentSpacing={0}
      content={<Text style={styles.contentText}>copiedToClipboard</Text>}
      placement="top"
      contentStyle={styles.content}
      showChildInTooltip={false}
      onClose={() => {
        setCopied(false);
      }}>
      <TouchableOpacity onPress={copyToClipboard}>
        {copied ? <CopyIconActive /> : <CopyIcon />}
      </TouchableOpacity>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
