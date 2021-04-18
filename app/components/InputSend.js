import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KText from './KText';
import KInput from './KInput';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';

const { height, width } = Dimensions.get('window');
var inputWidth = width - 120;
var groupInputWidth = width - 60;
var buttonWidth = 40;

const InputSend = ({ onSendMessage, onSendCoin }) => {
  const [message, setMessage] = useState();

  const _handlePressSendMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  const _handlePressSendCoin = () => {
    onSendCoin();
  };

  if (onSendMessage && onSendCoin) {
    return (
      <View style={styles.rowContainer}>
        <TextInput
          multiline={true}
          placeholder={'Message'}
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={_handlePressSendMessage}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#6A63EE', '#59D4FC']}
            style={styles.button}>
            <Icon name={'send'} style={styles.icon} />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={_handlePressSendCoin}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#E06C39', '#DF8856']}
            style={styles.button}>
            <Image
              source={require('../../assets/icons/coins.png')}
              style={styles.buttonIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.rowContainer}>
        <TextInput
          multiline={true}
          placeholder={'Message'}
          value={message}
          onChangeText={setMessage}
          style={styles.group_input}
        />
        <TouchableOpacity onPress={_handlePressSendMessage}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#6A63EE', '#59D4FC']}
            style={styles.button}>
            <Icon name={'send'} style={styles.icon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
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
  icon: {
    fontSize: 18,
    fontFamily: 'FontAwesome',
    color: '#FFF',
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
  group_input: {
    width: groupInputWidth,
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
  },
});

export default InputSend;
