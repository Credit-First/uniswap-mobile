import React, { useState } from 'react';
import { View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Alert } from 'react-native';
import { KText } from '../../../components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBalance } from '../../../eos/tokens';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const { height, width } = Dimensions.get('window');
var textWidth = width - 60;

const KeyItem = ({ publicKey, privateKey, ...props }) => {

  const [text, setText] = useState(publicKey);

  const toggleKey = () => {
    if (text == publicKey) {
      setText(privateKey);
    } else {
      setText(publicKey);
    }
  };

  const copyToClipboard = () => {
  	Clipboard.setString(publicKey+","+privateKey);
  	Alert.alert('Key copied to Clipboard');
  };

  if(publicKey && privateKey) {
    return (
    <View style={styles.rowContainer}>
      <View style={[styles.container, props.style]}>
      <TouchableOpacity onPress={copyToClipboard}>
        <KText style={styles.text}>{text}</KText>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleKey}>
        <Icon name={'lock'} size={25} color="#000000" />
      </TouchableOpacity>
      </View>
    </View>
    );
  } else {
    return null;
  }

};

const styles = StyleSheet.create({
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 6,
    elevation: 4,
    backgroundColor: '#F1F6FF',
    padding: 5,
  },
  contentContainer: {
    marginLeft: 20,
  },
  text: {
    width: textWidth,
    fontSize: 15,
    color: PRIMARY_BLACK,
  },
});

export default KeyItem;
