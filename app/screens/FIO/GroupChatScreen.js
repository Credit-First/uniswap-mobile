import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './FIOChat.style';
import { KHeader, InputSend } from '../../components';
import MessageListItem from './components/MessageListItem';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const GroupChatScreen = props => {
  const {
    navigation: { goBack },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const [messageList, setMessageList] = useState([]);

  const groupChatEndpoint = 'https://fiochat.eostribe.io/group_chat';

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'FIO';
  });

  if (fioAccounts.length === 0) {
    Alert.alert('No FIO account exists int this wallet!');
    goBack();
    return;
  }

  let myAccount = fioAccounts[0];

  const processMessages = json => {
    var messages = [];
    for (var i in json) {
      let item = json[i];
      item.from = item.sender;
      item.fromAddress = item.sender;
      item.created = item.created_date;
      messages.push(json[i]);
    }
    messages.push({ reload: true });
    setMessageList(messages);
  };

  const loadMessages = () => {
    try {
      fetch(groupChatEndpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => processMessages(json))
        .catch(error =>
          log({
            description: 'loadMessages - fetch GET ' + groupChatEndpoint,
            cause: error,
            location: 'GroupChatScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'loadMessages',
        cause: err,
        location: 'GroupChatScreen',
      });
      return;
    }
  };

  const refreshMessages = () => {
    //loadMessages();
  };

  const getTitle = () => {
    return 'Open Group Chat';
  };

  const getSubtitle = () => {
    return 'chat as ' + myAccount.address;
  };

  const _handleSendMessage = async message => {
    if (!message) {
      return;
    }
    try {
      fetch(groupChatEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: myAccount.address,
          message: message,
        }),
      })
        .then(response => response.json())
        .then(json => loadMessages(json))
        .catch(error =>
          log({
            description:
              '_handleSendMessage - fetch ' + groupChatEndpoint + ' [POST]',
            cause: error,
            sender: myAccount.address,
            message: message,
            location: 'GroupChatScreen',
          }),
        );
    } catch (err) {
      Alert.alert(err.message);
      log({
        description: '_handleSendMessage - send group chat message',
        cause: err,
        sender: myAccount.address,
        message: message,
        location: 'GroupChatScreen',
      });
    }
  };

  const _handleBack = () => {
    goBack();
  };

  if (messageList.length === 0) {
    //loadMessages();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={_handleBack}>
        <MaterialIcon
          name={'keyboard-backspace'}
          size={24}
          color={PRIMARY_BLUE}
        />
      </TouchableOpacity>
      <KHeader
        title={getTitle()}
        subTitle={getSubtitle()}
        style={styles.header}
      />
      <InputSend onSendMessage={_handleSendMessage} onSendCoin={null} />
      <FlatList
        data={messageList}
        keyExtractor={(item, index) => `${index}`}
        inverted={true}
        renderItem={({ item, index }) => (
          <MessageListItem
            item={item}
            myactor={myAccount.address}
            reloadAction={refreshMessages}
            style={styles.listItem}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default connectAccounts()(GroupChatScreen);
