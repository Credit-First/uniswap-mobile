import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import Colors from '../../../constant/colors';
import useColorScheme from '../../../hooks/useColorScheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import Icon from '../Icons';
import stylesMain from './styles';

const Button = ({
  onPress = () => null,
  title = undefined,
  type = 'fill',
  style = undefined,
  textStyles = undefined,
  children,
  disabled = false,
  size = 'lg',
  iconName = null,
  iconColor = undefined,
  iconSize = undefined,
  social = false,
  containerStyle = undefined,
  icon,
  customIconStyles,
}) => {
  const styles = useThemedStyles(stylesMain);
  const colorScheme = useColorScheme();
  const buttonStyles = React.useMemo(() => {
    const types = {
      fill: {
        button: styles.buttonFilled,
        buttonPressed: styles.buttonFilledPressed,
        text: styles.buttonText,
        textPressed: {},
        color: Colors[colorScheme].buttonText,
        colorPressed: {},
        shadow: styles.buttonFilledShadow,
      },
      outline: {
        button: styles.buttonOutlined,
        buttonPressed: styles.buttonOutlinedPressed,
        text: styles.buttonText,
        textPressed: {},
        color: Colors[colorScheme].buttonText,
        colorPressed: {},
        shadow: styles.buttonOutlinedShadow,
      },
      critical: {
        button: styles.buttonCritical,
        buttonPressed: styles.buttonCriticalPressed,
        text: styles.buttonText,
        textPressed: {},
        color: Colors[colorScheme].buttonText,
        colorPressed: {},
        shadow: styles.buttonCriticalShadow,
      },
      text: {
        button: styles.buttonTexted,
        buttonPressed: styles.buttonTextedPressed,
        text: styles.buttonTextedText,
        textPressed: styles.buttonTextedTextPressed,
        color: Colors[colorScheme].buttonTextTexted,
        colorPressed: Colors[colorScheme].buttonTextTextedPress,
        shadow: { alignSelf: 'flex-start' },
      },
    };

    const typesDisabled = {
      fill: {
        button: styles.buttonFilledDisabled,
        buttonPressed: styles.buttonFilledDisabled,
        text: styles.buttonTextDisabled,
        textPressed: {},
        color: Colors[colorScheme].buttonTextDisabled,
        colorPressed: {},
        shadow: styles.buttonFilledShadowDisabled,
      },
      outline: {
        button: styles.buttonOutlinedDisabled,
        buttonPressed: styles.buttonOutlinedDisabled,
        text: styles.buttonTextDisabled,
        textPressed: {},
        color: Colors[colorScheme].buttonTextDisabled,
        colorPressed: {},
        shadow: styles.buttonOutlinedShadowDisabled,
      },
      critical: {
        button: styles.buttonCriticalDisabled,
        buttonPressed: styles.buttonCriticalDisabled,
        text: styles.buttonTextDisabled,
        textPressed: {},
        color: Colors[colorScheme].buttonTextDisabled,
        colorPressed: {},
        shadow: styles.buttonCriticalShadowDisabled,
      },
      text: {
        button: styles.buttonTexted,
        buttonPressed: styles.buttonTexted,
        text: styles.buttonTextedTextDisabled,
        textPressed: {},
        color: Colors[colorScheme].buttonTextTextedDisabled,
        colorPressed: {},
        shadow: {},
      },
    };

    return disabled ? typesDisabled[type] : types[type];
  }, [type, disabled]);

  const textSize = React.useMemo(() => {
    const sizes = {
      sm: styles.buttonTextSm,
      md: styles.buttonTextMd,
      lg: styles.buttonTextLg,
    };
    return sizes[size];
  }, [size]);

  const buttonSize = React.useMemo(() => {
    const sizes = {
      sm: styles.buttonSm,
      md: styles.buttonMd,
      lg: styles.buttonLg,
    };
    return sizes[size];
  }, [size]);

  const buttonIconSize = React.useMemo(() => {
    const sizes = {
      sm: styles.buttonIconSm,
      md: styles.buttonIconMd,
      lg: styles.buttonIconLg,
    };
    return sizes[size];
  }, [size]);

  const iconSizes = React.useMemo(() => {
    const sizes = {
      sm: 12,
      md: 16,
      lg: 20,
    };
    return sizes[size];
  }, [size]);

  return (
    <Pressable
      onPress={onPress}
      style={[buttonStyles.shadow, containerStyle]}
      disabled={disabled}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            type !== 'text' && buttonSize,
            buttonStyles.button,
            pressed && buttonStyles.buttonPressed,
            (iconName || !!icon) &&
              title === undefined &&
              children === undefined &&
              buttonIconSize,
            style,
          ]}>
          {iconName || !!icon ? (
            <View
              style={[
                styles.icon,
                social && styles.iconSocial,
                (iconName || !!icon) &&
                  title === undefined &&
                  children === undefined &&
                  styles.buttonIcon,
                customIconStyles,
              ]}>
              {icon ? (
                icon
              ) : (
                <Icon
                  name={iconName}
                  fill={iconColor || buttonStyles.color}
                  stroke={iconColor || buttonStyles.color}
                  size={iconSize || iconSizes}
                />
              )}
            </View>
          ) : null}

          {title ? (
            <Text
              style={[
                textSize,
                buttonStyles.text,
                textStyles,
                pressed && buttonStyles.textPressed,
              ]}>
              {title}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
