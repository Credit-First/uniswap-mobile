import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import KText from './KText';
import { PRIMARY_BLUE } from '../theme/colors';

const KInput = ({ label, secureTextEntry, containerStyle, ...props }) => {
  const [showText, setShowText] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <KText style={styles.label}>{label}</KText>
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry && !showText}
        underlineColorAndroid={'transparent'}
        style={styles.input}
      />
      {!!secureTextEntry && (
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowText(!showText)}>
          <KText style={styles.label}>{showText ? 'Hide' : 'Show'}</KText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#E5E5EE',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    color: PRIMARY_BLUE,
  },
  input: {
    marginTop: Platform.OS === 'ios' ? 12 : 0,
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    lineHeight: 22,
    marginBottom: 12,
  },
  showButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default KInput;
