import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioSendMessage, getFioChatEndpoint } from '../../eos/fio';
import styles from './FIOChat.style';
import { KHeader, KSelect, InputSend } from '../../components';
import MessageListItem from './components/MessageListItem';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const FIOChatScreen = props => {
  const {
    navigation: { navigate, goBack },
    accountsState: { accounts, addresses },
    route: {
      params: { fioAddress, index, fromFioAddress },
    },
  } = props;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [messageList, setMessageList] = useState([]);

  // const fioEndpoint = getEndpoint('FIO');
  const chatEndpoint = getFioChatEndpoint();

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'FIO';
  });

  if (fioAccounts.length === 0) {
    Alert.alert('No FIO account exists int this wallet!');
    goBack();
    return;
  }

  let fromAccount = fioAccounts[0];
  if (fromFioAddress != null) {
    let matchingFioAccounts = fioAccounts.filter((value, index, array) => {
      return value.address === fromFioAddress;
    });
    if (matchingFioAccounts.length > 0) {
      fromAccount = matchingFioAccounts[0];
    } else {
      Alert.alert('Failed to find imported accounts for ' + fromFioAddress);
      return;
    }
  }

  const fromPrivateKey = fromAccount.privateKey;
  const fromPublicKey = Ecc.privateToPublic(fromPrivateKey);
  const fromActor = Fio.accountHash(fromPublicKey);
  let toFioAddress = fioAddress;

  if (!fioAddress.publicKey && fioAddress.indexOf('@') > 0) {
    let matchingFioAddress = addresses.filter((value, index, array) => {
      return value.address === fioAddress;
    });
    if (matchingFioAddress.length > 0) {
      toFioAddress = matchingFioAddress[0];
    } else {
      Alert.alert('Can not find address ' + fioAddress + ' in addressbook');
      return;
    }
  }
  // let toAddress = toFioAddress.address;
  let toActor = toFioAddress.actor;
  let toPublicKey = toFioAddress.publicKey;

  const cipher = Fio.createSharedCipher({
    privateKey: fromPrivateKey,
    publicKey: toPublicKey,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  });

  const processEncryptedMessages = (json, pendingMessage) => {
    var messages = [];
    for (var i in json) {
      let item = json[i];
      try {
        let decryptedMessage = cipher.decrypt(
          'record_obt_data_content',
          item.message,
        );
        item.message = decryptedMessage.memo;
        item.fromAddress = decryptedMessage.hash;
        item.toAddress = decryptedMessage.offline_url;
        messages.push(item);
      } catch (err) {
        let errJson = {
          cause: err,
          item: item,
          description: 'Error decrypting message',
        };
        log({
          description: 'processEncryptedMessages',
          cause: errJson,
          location: 'FIOChatScreen',
        });
      }
    }
    if (pendingMessage) {
      messages.push(pendingMessage);
    }
    messages.push({ reload: true });
    setMessageList(messages);
  };

  const loadMessages = (from, to, pendingMessage) => {
    let endpoint = chatEndpoint + '/' + from + '/' + to;
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
        .catch(error =>
          log({
            description: 'loadMessages - fetch ' + endpoint,
            cause: error,
            location: 'FIOChatScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'loadMessages',
        cause: err,
        location: 'FIOChatScreen',
      });
      return;
    }
  };

  const refreshMessages = () => {
    loadMessages(fromActor, toActor);
  };

  if (index !== currentIndex) {
    setCurrentIndex(index);
    loadMessages(fromActor, toActor);
  } else if (fromFioAddress != null && messageList.length > 0) {
    loadMessages(fromActor, toActor);
  }

  const getTitle = () => {
    return 'FIO Chat';
  };

  const getSubtitle = () => {
    return fromAccount.address + ' to ' + toFioAddress.address;
  };

  const _handleSendMessage = async message => {
    if (!message) {
      return;
    }
    try {
      await fioSendMessage(
        fromAccount,
        toFioAddress.address,
        toFioAddress.publicKey,
        message,
      );
      let pendingMessage = {
        created: 'Now',
        from: fromActor,
        fromAddress: fromAccount.address,
        message: message,
        to: toActor,
        toAddress: toFioAddress.address,
      };
      loadMessages(fromActor, toActor, pendingMessage);
    } catch (err) {
      Alert.alert(err.message);
      log({
        description: '_handleSendMessage - fioSendMessage',
        cause: err,
        location: 'FIOChatScreen',
      });
    }
  };

  const _handleBack = () => {
    goBack();
  };

  const _handleChangeFromAccount = (value, index) => {
    // const fromFioAddress = value.address;
    navigate('FIOChat', { fioAddress, index, fromFioAddress });
  };

  const _handleFIOSendCoin = () => {
    const fromFioAccount = fromAccount;
    navigate('FIOSendDirect', { fromFioAccount, toFioAddress });
  };

  if (fioAccounts.length > 1) {
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
        <KSelect
          items={fioAccounts.map((item, index, self) => ({
            label: `${item.address}`,
            value: item,
          }))}
          onValueChange={_handleChangeFromAccount}
          containerStyle={styles.inputContainer}
        />
        <InputSend
          onSendMessage={_handleSendMessage}
          onSendCoin={_handleFIOSendCoin}
        />
        <FlatList
          data={messageList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <MessageListItem
              item={item}
              myactor={fromActor}
              reloadAction={refreshMessages}
              style={styles.listItem}
            />
          )}
        />
      </SafeAreaView>
    );
  } else {
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
        <InputSend
          onSendMessage={_handleSendMessage}
          onSendCoin={_handleFIOSendCoin}
        />
        <FlatList
          data={messageList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <MessageListItem
              item={item}
              myactor={fromActor}
              reloadAction={refreshMessages}
              style={styles.listItem}
            />
          )}
        />
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(FIOChatScreen);
