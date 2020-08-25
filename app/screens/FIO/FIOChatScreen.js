import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
  Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioSendMessage, getFioChatEndpoint } from '../../eos/fio';
import ecc from 'eosjs-ecc-rn';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KInput, KSelect, KText, InputSend } from '../../components';
import MessageListItem from './components/MessageListItem';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { connectAccounts } from '../../redux';
import {
  supportedChains,
  getChain,
  getEndpoint } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';


const FIOChatScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, activeAccountIndex, addresses },
    route: {
      params: {
        fioAddress,
      },
    },
  } = props;

  const [runCount, setRunCount] = useState(0);
  const [messageList, setMessageList] = useState([]);

  const fioEndpoint = getEndpoint('FIO');
  const chatEndpoint = getFioChatEndpoint();

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  if(fioAccounts.length === 0) {
    Alert.alert('No FIO account exists int this wallet!');
    goBack();
    return;
  }

  const fromAccount = fioAccounts[0];
  const fromPrivateKey = fromAccount.privateKey;
  const fromPublicKey = Ecc.privateToPublic(fromPrivateKey);
  const fromActor = Fio.accountHash(fromPublicKey);
  const toActor = fioAddress.actor;
  const toPublicKey = fioAddress.publicKey;

  const cipher = Fio.createSharedCipher({
    privateKey: fromPrivateKey,
    publicKey: toPublicKey,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  });

  const processEncryptedMessages = (json, pendingMessage) => {
    var messages = [];
    for(var i in json) {
      let item = json[i];
      try {
        let decryptedMessage = cipher.decrypt('record_obt_data_content', item.message);
        item.message = decryptedMessage.memo;
        item.fromAddress = decryptedMessage.hash;
        item.toAddress = decryptedMessage.offline_url;
        messages.push(item);
      } catch(err) {
        let errJson = { cause: err, item: item, description: 'Error decrypting message' };
        log({
          description: 'processEncryptedMessages',
          cause: errJson,
          location: 'FIOChatScreen'
        });
      }
    }
    if(pendingMessage) {
      messages.push(pendingMessage);
    }
    messages.push({"reload": true});
    setMessageList(messages);
  };

  const loadMessages = (from, to, pendingMessage) => {
    let endpoint = chatEndpoint+'/'+from+'/'+to;
    try {
      fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => processEncryptedMessages(json, pendingMessage))
        .catch(error => log({
          description: 'loadMessages - fetch '+endpoint,
          cause: error,
          location: 'FIOChatScreen'
        })
      );
    } catch (err) {
      log({ description: 'loadMessages', cause: err, location: 'FIOChatScreen'});
      return;
    }
  };

  const refreshMessages = () => {
    loadMessages(fromActor, toActor);
  };

  if(runCount < 1) {
    setRunCount(1);
    loadMessages(fromActor, toActor);
  }

  const getTitle = () => {
    return 'Chat with ' + fioAddress.address;
  };

  const _handleSubmit = async (message) => {
    if(!message) return;
    try {
      await fioSendMessage(fromAccount, fioAddress.address, fioAddress.publicKey, message);
      let pendingMessage = {
        "created": "Now",
        "from": fromActor,
        "fromAddress": fromAccount.address,
        "message": message,
        "to": toActor,
        "toAddress": fioAddress.address
      };
      loadMessages(fromActor, toActor, pendingMessage);
    } catch (err) {
      Alert.alert(err.message);
      log({
        description: '_handleSubmit - fioSendMessage',
        cause: err,
        location: 'FIOChatScreen'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
              />
          </TouchableOpacity>
          <KHeader title={getTitle()} style={styles.header}/>
          <View style={styles.spacer} />
          <FlatList
              data={messageList}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => (
                <MessageListItem item={item} myactor={fromActor} reloadAction={refreshMessages} style={styles.listItem} />
              )}
              />
          <InputSend onPress={_handleSubmit}/>
    </SafeAreaView>
  );

};

/*
<KSelect
  label={'Using my FIO address'}
  items={fioAccounts.map(item => ({
    label: `${item.address}`,
    value: item,
  }))}
  onValueChange={setFromAccount}
  containerStyle={styles.inputContainer}
/>
*/

export default connectAccounts()(FIOChatScreen);
