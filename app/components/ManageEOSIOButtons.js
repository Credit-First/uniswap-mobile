import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const ManageEOSIOButtons = ({
  onManageResourcesPress,
  onVoteBPPress,
  onSaveKeyPress,
  onDeletePress,
  manageResourcesIcon,
  voteBPIcon,
  saveKeyIcon,
  deleteIcon
}) => {

  return (
      <View style={styles.rowContainer}>
      <TouchableOpacity onPress={onManageResourcesPress}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FFFFFF', '#FFFFFF']}
          style={styles.container}>
          <View style={styles.icon}>{manageResourcesIcon()}</View>
        </LinearGradient>
      </TouchableOpacity>
        <TouchableOpacity onPress={onVoteBPPress}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{voteBPIcon()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSaveKeyPress}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{saveKeyIcon()}</View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeletePress}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FFFFFF', '#FFFFFF']}
            style={styles.container}>
            <View style={styles.icon}>{deleteIcon()}</View>
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
    margin: 5,
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

export default ManageEOSIOButtons;
