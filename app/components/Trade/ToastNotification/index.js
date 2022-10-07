import * as React from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';

import useColorScheme from '../../../hooks/useColorScheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import stylesMain from './styles';

const ToastNotification = ({}) => {
  const styles = useThemedStyles(stylesMain);
  const colorScheme = useColorScheme();

  const toastConfig = {
    success: props => (
      <SuccessToast
        {...props}
        style={styles.success}
        contentContainerStyle={styles.container}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        style={styles.error}
        contentContainerStyle={styles.container}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    info: props => (
      <InfoToast
        {...props}
        style={styles.info}
        contentContainerStyle={styles.container}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    warning: props => (
      <BaseToast
        {...props}
        style={styles.warning}
        contentContainerStyle={styles.container}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
  };

  return (
    <Toast
      config={toastConfig}
      position="bottom"
      visibilityTime={3000}
      bottomOffset={50}
    />
  );
};

export default ToastNotification;
