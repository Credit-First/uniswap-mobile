import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KText from './KText';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';

const { height, width } = Dimensions.get('window');
var buttonWidth = width/2 - 31;

const RequestSendButtons = ({
  icon,
  style,
  renderIcon,
  onRequestPress,
  onSendPress,
  visible = true,
}) => {

  const renderMaterialIcon = () => {
    if (!!icon && typeof icon === 'string') {
      return <Icon name={icon} style={styles.icon} />;
    }

    return null;
  };

  const renderIconComponent = () => {
    if (!!renderIcon && typeof renderIcon === 'function') {
      return <View style={styles.iconComponentWrapper}>{renderIcon()}</View>;
    }

    return null;
  };

  if(visible) {
    return (
      <View style={styles.rowContainer}>
       <TouchableOpacity onPress={onRequestPress} style={style}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#E06C39', '#DF8856']}
          style={styles.container}>
          {renderMaterialIcon()}
          {renderIconComponent()}
          <KText style={styles.title}>FIO Request</KText>
        </LinearGradient>
       </TouchableOpacity>
       <TouchableOpacity onPress={onSendPress} style={style}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#6A63EE', '#59D4FC']}
          style={styles.container}>
          {renderMaterialIcon()}
          {renderIconComponent()}
          <KText style={styles.title}>FIO Send</KText>
        </LinearGradient>
       </TouchableOpacity>
      </View>
    );
  } else {
    return (<View style={styles.spacer} />);
  }
};

const styles = StyleSheet.create({
  container: {
    width: buttonWidth,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    margin: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 18,
    color: '#FFF',
    marginRight: 8,
  },
  iconComponentWrapper: {
    marginRight: 8,
  },
  spinner: {
    marginLeft: 8,
  },
  rowContainer: {
    marginTop: 10,
    flexDirection: 'row',
  }
});

export default RequestSendButtons;
