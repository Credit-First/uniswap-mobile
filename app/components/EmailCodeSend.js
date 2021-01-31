import React, { useState } from 'react';
import { View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions } from 'react-native';
import KText from './KText';
import KInput from './KInput';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';

const { height, width } = Dimensions.get('window');
var inputWidth = width - 120;
var buttonWidth = 100;


const EmailCodeSend = ({onChange, onSendCode}) => {

  const [email, setEmail] = useState();

  const _handleChangeEmail = (value) => {
    let lcv = (value)?value.toLowerCase():'';
    setEmail(lcv);
    onChange(lcv);
  };

  const _handlePressSendCode = () => {
    onSendCode(email);
  };

  return (
      <View style={styles.rowContainer}>
        <TextInput
          multiline={true}
          placeholder={'Email'}
          value={email}
          onChangeText={_handleChangeEmail}
          style={styles.input}
          />
       <TouchableOpacity onPress={_handlePressSendCode}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#6A63EE', '#59D4FC']}
          style={styles.button}>
          <KText style={styles.title}>Send Code</KText>
        </LinearGradient>
       </TouchableOpacity>
      </View>
  );

};

const styles = StyleSheet.create({
  button: {
    width: buttonWidth,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    margin: 5,
    padding: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: inputWidth,
    marginTop: Platform.OS === 'ios' ? 12 : 0,
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    lineHeight: 22,
    marginBottom: 12,
    marginLeft: 6,
  },
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default EmailCodeSend;
