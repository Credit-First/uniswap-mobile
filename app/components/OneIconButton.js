import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const OneIconButton = ({
  icon,
  onIconPress,
}) => {

  return (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={onIconPress}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{icon()}</View>
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
    margin: 5,
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

export default OneIconButton;
