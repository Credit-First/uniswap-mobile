import * as React from 'react';

import { waitForModal } from '../../helpers/helpers';
import useThemedStyles from '../../hooks/useThemedStyles';
import AlertWarning from '../AlertWarning';
import Button from '../Button';
import ModalBottom from '../ModalBottom';
import { View } from '../Themed';
import stylesMain from './styles';

const ModalConfirmTransaction = ({
  isVisible,
  setIsVisible,
  TransactionDetailsComponent,
  textWarning,
  onCancel,
  onConfirm,
  title,
  modalHeight,
}) => {
  const styles = useThemedStyles(stylesMain);

  const handleOnConfirm = async () => {
    setIsVisible(false);
    await waitForModal();
    onConfirm();
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    onCancel && onCancel();
  };

  return (
    <>
      <ModalBottom
        modalHeight={modalHeight || 65}
        expandHeight={80}
        visible={isVisible}
        backdropOpacity={0.7}
        swipeDirection={'down'}
        onClose={handleOnCancel}
        titleText={title || ''}>
        <>
          <View style={styles.transactionDetails}>
            {TransactionDetailsComponent}
          </View>
          {textWarning && (
            <View style={styles.warning}>
              {<AlertWarning text={textWarning} />}
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm"
              onPress={handleOnConfirm}
              containerStyle={styles.button}
            />
            <Button
              title="cancel"
              onPress={handleOnCancel}
              type={'outline'}
              containerStyle={styles.button}
            />
          </View>
        </>
      </ModalBottom>
    </>
  );
};

export default ModalConfirmTransaction;
