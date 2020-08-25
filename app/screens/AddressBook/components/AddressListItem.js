import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { KText } from '../../../components';
import { log } from '../../../logger/logger';
import { getFioChatEndpoint } from '../../../eos/fio';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';


const AddressListItem = ({ address, fromactor, onPress, ...props }) => {


  const [msgCount, setMsgCount] = useState(0);
  const [runCount, setRunCount] = useState(0);

  const chatEndpoint = getFioChatEndpoint();

  const updateCount = (json) => {
    setMsgCount(json.count);
  }

  const loadMessageCount = (from, to) => {
    let endpoint = chatEndpoint+'/'+from+'/'+to+'/count';
    console.log(endpoint);
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
      return address.name + "<" + address.address + "> [" + msgCount + " msgs]";
    } else {
      return address.name + "<" + address.address + ">";
    }
  };

  return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <View style={styles.contentContainer}>
            <KText style={styles.address}>{getItemText()}</KText>
          </View>
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
    padding: 5,
  },
  contentContainer: {
    marginLeft: 20,
  },
  address: {
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
});

export default AddressListItem;
