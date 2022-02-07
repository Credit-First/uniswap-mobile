import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const FiveIconsButtons = ({
  icon1,
  onIcon1Press,
  icon2,
  onIcon2Press,
  icon3,
  onIcon3Press,
  icon4,
  onIcon4Press,
  icon5,
  onIcon5Press,
}) => {

  return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={onIcon1Press}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon1()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIcon2Press}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon2()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIcon3Press}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon3()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIcon4Press}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon4()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIcon5Press}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon5()}</View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );

};

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    margin: 0,
  },
  rowContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  icon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FiveIconsButtons;
