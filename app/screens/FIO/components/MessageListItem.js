import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KText } from '../../../components';
import { PRIMARY_BLACK } from '../../../theme/colors';

const MessageListItem = ({
  item,
  myactor,
  reloadAction,
  onPress,
  ...props
}) => {
  const _handleOnPress = () => {
    if (item.reload) {
      reloadAction();
    } else if (onPress) {
      onPress(item);
    }
  };

  const formatDate = date => {
    if (date.indexOf('T') > 0) {
      var dateTime = date.split('T');
      return dateTime[0] + ' ' + dateTime[1] + ' UTC';
    } else {
      return date;
    }
  };

  const getItemStyle = () => {
    if (item.from === myactor) {
      return styles.my_message;
    } else {
      return styles.message;
    }
  };

  if (item.reload) {
    return (
      <TouchableOpacity onPress={_handleOnPress}>
        <View style={styles.reload}>
          <View style={styles.contentContainer}>
            <KText style={styles.item}>{'refresh messages'}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={_handleOnPress}>
        <View style={[getItemStyle(), props.style]}>
          <View style={styles.contentContainer}>
            <Text style={styles.date}>
              {item.fromAddress} @ {formatDate(item.created)}
            </Text>
            <KText style={styles.item}>{item.message}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#F1F6FF',
    padding: 5,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 5,
  },
  my_message: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#E4FFE7',
    padding: 5,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 5,
  },
  reload: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#FFE8CE',
    padding: 5,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 5,
  },
  contentContainer: {
    marginLeft: 20,
  },
  item: {
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
  date: {
    fontSize: 10,
    color: PRIMARY_BLACK,
  },
});

export default MessageListItem;
