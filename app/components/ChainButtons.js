import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ChainButtons = ({
  onChainPress,
  onClosePress,
  closeIcon,
  bscIcon,
  ethIcon,
  fioIcon,
  telosIcon,
  algoIcon,
  xlmIcon
}) => {

  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity onPress={onClosePress}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{closeIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('BNB')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{bscIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('ETH')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{ethIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('FIO')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{fioIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('TLOS')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{telosIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('ALGO')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{algoIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChainPress('XLM')}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{xlmIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    margin: 3,
  },
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
  },
  icon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: '#FFF',
  },
});

export default ChainButtons;
