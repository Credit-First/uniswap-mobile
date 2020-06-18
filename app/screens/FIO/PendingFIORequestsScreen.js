import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioNewFundsRequest } from '../../eos/fio';
import ecc from 'eosjs-ecc-rn';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { supportedChains, getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const PendingFIORequestsScreen = props => {

  const {
    navigation: { navigate, goBack },
    route: {
      params: {
        fioAccount,
        fioRequests
      },
    },
    accountsState: { accounts },
  } = props;

  const _handleViewFIORequest = (request) => {
    console.log(request);
  }

  const getRequestTitle = (item) => {
    return item.payer_fio_address + ' -> ' + item.payee_fio_address;
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
        <KHeader title={'Pending FIO Requests'} subTitle={fioAccount.address} style={styles.header} />
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

export default connectAccounts()(PendingFIORequestsScreen);
