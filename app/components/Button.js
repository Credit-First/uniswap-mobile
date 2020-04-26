import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Button = ({ title, theme = 'primary', icon }) => {
  const getGradientColors = () => {
    let colors = ['#6A63EE', '#59D4FC'];
    if (theme === 'primary') {
      colors = ['#6A63EE', '#59D4FC'];
    } else if (theme === 'brown') {
      colors = ['#E06C39', '#DF8856'];
    } else if (theme === 'gray') {
      colors = ['#C6D3DD', '#C6D3DD'];
    }

    return colors;
  };

  return (
    <TouchableOpacity>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={getGradientColors()}
        style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
