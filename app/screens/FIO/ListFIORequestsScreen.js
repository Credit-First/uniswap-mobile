
import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';


const ListFIORequestsScreen = props => {

  const {
    navigation: { navigate, goBack },
    route: {
      params: {
        fioAccount,
        fioRequests,
        title,
      },
    },
    accountsState: { accounts },
  } = props;

  const _handleViewFIORequest = (fioRequest) => {
    navigate('ViewFIORequest', { fioAccount, fioRequest, title });
  }

  const getRequestTitle = (item) => {
    return item.fio_request_id + ": " + item.payer_fio_address;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={24}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <KHeader title={title} subTitle={fioAccount.address} style={styles.header} />
        <FlatList
          data={fioRequests}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <KButton
              title={getRequestTitle(item)}
              style={styles.button}
              onPress={() => _handleViewFIORequest(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(ListFIORequestsScreen);
