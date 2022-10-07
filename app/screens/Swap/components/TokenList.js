import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';

const TokenList = ({ tokenList, handleSelectToken, type }) => {
  return (
    <View style={styles.container}>
      {tokenList.map(item => {
        return (
          <Pressable
            key={item.chainId}
            style={styles.chainName}
            onPress={() => handleSelectToken(item, type)}>
            <Text style={styles.chainName}>
              <Image source={item.chainIcon} style={styles.icon} />{' '}
              {item.symbol}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default TokenList;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  chainName: {
    padding: 0,
    color: '#6A63EE',
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
  },
});
