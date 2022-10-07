import * as React from 'react';
import { Dimensions, Keyboard, StyleProp, View, ViewProps } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import Animated, {
  event,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { validate } from 'uuid';

import Colors from '../../../constant/colors';
import { isAppleDevices } from '../../../helpers/app';
import { verticalScale } from '../../../helpers/dimensions';
import useColorScheme from '../../../hooks/useColorScheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { Text } from '../Themed';
import ToastNotification from '../ToastNotification';
import stylesMain from './styles';

const { height: screenHeight } = Dimensions.get('window');

const config = {
  modalMaxHeight: 96,
};

const ModalBottom = ({
  visible,
  onClose,
  onModalHide,
  modalHeight = 30,
  containerStyle,
  swipeDirection = ['up', 'down'],
  animation,
  backdropOpacity,
  children,
  expandHeight = 0,
  avoidKeyboard = false,
  secondModal = false,
  titleText,
  additionalText,
}) => {
  const styles = useThemedStyles(stylesMain);
  const colorScheme = useColorScheme();

  const getHeightNumber = value => {
    return typeof value === 'string' ? Number(value.replace('px', '')) : value;
  };

  const getMaxModalHeight = config.modalMaxHeight / 100;

  const calculateHeight = (heightValue, keyboardHeight) => {
    // 96% of height will not allow modal to cover entire screen
    let visibleScreen = screenHeight - (keyboardHeight ? keyboardHeight : 0);
    let resultedHeight;

    // parse px strings
    if (typeof heightValue === 'string' && heightValue.includes('px')) {
      resultedHeight =
        getHeightNumber(heightValue) > screenHeight
          ? screenHeight * getMaxModalHeight
          : getHeightNumber(heightValue);
      // parse percentage
    } else {
      resultedHeight =
        heightValue > 100
          ? screenHeight * getMaxModalHeight
          : screenHeight * (Number(heightValue) / 100);
    }

    //
    return resultedHeight > visibleScreen
      ? visibleScreen * getMaxModalHeight
      : resultedHeight;
  };

  const modalHeightShared = useSharedValue(calculateHeight(modalHeight));
  const touchStart = useSharedValue(0);
  const touchEnd = useSharedValue(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(modalHeightShared.value, {
        duration: 300,
      }),
    };
  });

  // Keyboard handle height logic
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  /**
   * This hook handles if modal with keyboard is higher than scree and bounces it. KeyboardWillShow is not triggering in Android
   * https://github.com/facebook/react-native/issues/3468
   */
  React.useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      isAppleDevices ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        //console.log('Modal keyboard show');
        setKeyboardOpen(true);
        if (avoidKeyboard) {
          modalHeightShared.value = calculateHeight(
            modalHeight,
            event.endCoordinates.height,
          );
        }
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      isAppleDevices ? 'keyboardWillHide' : 'keyboardDidHide',
      event => {
        //console.log('Modal keyboard hide');
        setKeyboardOpen(false);
        if (avoidKeyboard) {
          modalHeightShared.value = calculateHeight(
            modalHeight,
            event.endCoordinates.height,
          );
        }
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!secondModal) {
      setIsExpanded(false);
    }
    modalHeightShared.value = calculateHeight(modalHeight);
  }, [secondModal, modalHeight]);

  const handleExpand = React.useCallback(() => {
    if (!expandHeight || isExpanded || secondModal) {
      return;
    }
    const start = touchStart.value;
    const end = touchEnd.value;
    const thresHold = start - end;
    console.log('Start: ' + start);
    console.log('End: ' + end);
    console.log('Threshold: ' + thresHold);
    if (Math.abs(thresHold) > 20) {
      modalHeightShared.value = calculateHeight(expandHeight);
      touchStart.value = 0;
      touchEnd.value = 0;
      setIsExpanded(true);
    }
  }, [isExpanded, touchEnd.value, touchStart.value, secondModal, keyboardOpen]);

  const reset = () => {
    if (onModalHide) {
      onModalHide();
    }
    modalHeightShared.value = calculateHeight(modalHeight);
    setIsExpanded(false);
  };

  return (
    <Modal
      panResponderThreshold={10}
      isVisible={visible}
      backdropColor={Colors[colorScheme].modal.modalOverlay}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={
        swipeDirection
          ? swipeDirection.length
            ? swipeDirection
            : [swipeDirection]
          : undefined
      }
      style={styles.modal}
      propagateSwipe={true}
      onModalHide={reset}
      swipeThreshold={100}
      avoidKeyboard={avoidKeyboard}
      backdropOpacity={backdropOpacity}
      {...animation}>
      <View style={styles.centeredView}>
        <Animated.View style={[styles.modalView, animatedStyles]}>
          <View
            style={[styles.lineWrapper, { zIndex: 1 }]}
            onTouchStart={event =>
              (touchStart.value = event.nativeEvent.locationY)
            }
            onTouchMove={event => {
              console.log('here');
              touchEnd.value = event.nativeEvent.locationY;
              handleExpand();
            }}>
            <View style={styles.line} />
          </View>
          <View style={[styles.container]}>
            {/* Adding default container with title to simplify component usage */}
            {titleText || additionalText ? (
              <View style={[styles.contentContainer, containerStyle]}>
                {titleText && (
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{titleText}</Text>
                  </View>
                )}
                {additionalText && (
                  <View style={styles.additionalTextContainer}>
                    <Text style={styles.additionalText}>{additionalText}</Text>
                  </View>
                )}
                <>{children}</>
              </View>
            ) : (
              <>{children}</>
            )}
          </View>
        </Animated.View>
      </View>
      <ToastNotification />
    </Modal>
  );
};
export default ModalBottom;
