import React, { useState } from 'react';
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { KText } from '../../../components';
import { log } from '../../../logger/logger';
import { getFioChatEndpoint } from '../../../eos/fio';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const { height, width } = Dimensions.get('window');
var textWidth = width - 120;
var buttonWidth = 40;


const AddressListItem = ({ address, fromactor, onPress, onEdit, ...props }) => {

  const [msgCount, setMsgCount] = useState(0);
  const [runCount, setRunCount] = useState(0);

  const chatEndpoint = getFioChatEndpoint();

  const updateCount = (json) => {
    setMsgCount(json.count);
    address.msgCount = json.count;
  }

  const loadMessageCount = (from, to) => {
    let endpoint = chatEndpoint+'/'+from+'/'+to+'/count';
    try {
      fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => updateCount(json))
        .catch(error => log({
          description: 'loadMessageCount - fetch '+endpoint,
          cause: error,
          location: 'AddressListItem'
        })
      );
    } catch (err) {
      log({ description: 'loadMessages', cause: err, location: 'FIOChatScreen'});
      return;
    }
  };

  if(runCount < 1 && fromactor) {
    setRunCount(1);
    loadMessageCount(fromactor, address.actor);
  }

  const getItemText = () => {
    if(msgCount > 0) {
      return address.name + " <" + address.address + "> [" + msgCount + " msgs]";
    } else {
      return address.name + " <" + address.address + ">";
    }
  };

  return (
      <TouchableOpacity>
        <View style={[styles.container, props.style]}>
          <View style={styles.rowContainer}>
           <Text onPress={onPress} style={styles.address}>{getItemText()}</Text>
          </View>
          <TouchableOpacity onPress={onEdit}>
           <LinearGradient
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             colors={['#6A63EE', '#59D4FC']}
             style={styles.button}>
             <Icon name={'edit'} style={styles.icon} />
           </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
  );

};

const styles = StyleSheet.create({
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
    padding: 3,
  },
  address: {
    width: textWidth,
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#273D52',
    marginLeft: 10,
    padding: 0,
  },
  button: {
    width: buttonWidth,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    margin: 0,
    padding: 0,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 18,
    color: '#FFF',
  },
  rowContainer: {
    margin: 0,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default AddressListItem;
