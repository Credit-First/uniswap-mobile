import React, { useState } from 'react';
import { View,
  TextInput,
  StyleSheet,
  Dimensions } from 'react-native';
import KText from './KText';
import KInput from './KInput';

const { height, width } = Dimensions.get('window');
var inputWidth = width - 180;
var domainWidth = 100;


const InputAddress = ({onChange}) => {

  const [name, setName] = useState();

  const _handleChangeName = (value) => {
    if(value) {
      setName(value.toLowerCase());
      onChange(value.toLowerCase());
    } else {
      setName('');
      onChange('');
    }
  };

  return (
      <View style={styles.rowContainer}>
        <TextInput
          label={'Name'}
          autoCapitalize={false}
          placeholder={'Enter your name'}
          value={name}
          onChangeText={_handleChangeName}
          style={styles.input}
          />
          <KText style={styles.domain}>@tribe</KText>
      </View>
  );

};

const styles = StyleSheet.create({
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: inputWidth,
    marginTop: Platform.OS === 'ios' ? 12 : 0,
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    lineHeight: 22,
    marginBottom: 12,
    marginLeft: 0,
  },
  domain: {
    width: domainWidth,
    marginTop: Platform.OS === 'ios' ? 12 : 0,
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    lineHeight: 22,
    marginBottom: 12,
    marginLeft: 3,
  },
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default InputAddress;
