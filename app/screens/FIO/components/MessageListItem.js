import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KText } from '../../../components';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';


const MessageListItem = ({ item, ...props }) => {

  const _handleOnPress = () => {
    console.log(item);
  };

  const formatDate = (date) => {
    var dateTime = date.split('T');
    return dateTime[0] + " " + dateTime[1] + " UTC";
  };

  return (
      <TouchableOpacity onPress={_handleOnPress}>
        <View style={[styles.container, props.style]}>
          <View style={styles.contentContainer}>
            <Text style={styles.date}>{formatDate(item.created)}</Text>
            <KText style={styles.item}>{item.message}</KText>
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
    shadowRadius: 4,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#F1F6FF',
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
