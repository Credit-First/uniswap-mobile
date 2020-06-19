import React, { useState, useEffect } from 'react';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import QRCode from 'react-native-qrcode-svg';
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
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getChain } from '../../eos/chains';

const ViewFIORequestScreen = props => {

  const {
    navigation: { navigate, goBack },
    route: {
      params: {
        fioAccount,
        fioRequest,
        title
      },
    },
    accountsState: { accounts },
  } = props;


  var otherPublicKey = fioRequest.payer_fio_public_key;
  if (fioAccount.address == fioRequest.payer_fio_address) {
    otherPublicKey = fioRequest.payee_fio_public_key;
  }
  const cipher = Fio.createSharedCipher({
    privateKey: fioAccount.privateKey,
    publicKey: otherPublicKey,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  });
  const decryptedContent = cipher.decrypt('new_funds_content', fioRequest.content);

  const getRequestTitle = () => {
    return fioRequest.payer_fio_address + ' -> ' + fioRequest.payee_fio_address;
  }

  const chain = getChain(decryptedContent.chain_code);
  var chainAccounts = [];
  if (chain) {
    chainAccounts = accounts.filter((value, index, array) => {
      return value.chainName !== chain.name;
    });
  }
  var payerRole = false;
  if (fioAccount.address == fioRequest.payer_fio_address) {
    payerRole = true;
  }

  const _handleAccept = () => {
    console.log("Accept");
  }

  const _handleReject = () => {
    console.log("Reject");
  }

  if(payerRole && chain && chainAccounts.length > 0) {
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
        <KHeader title={title} subTitle={getRequestTitle()} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Payer: {fioRequest.payer_fio_address}</KText>
        <KText>Payee: {fioRequest.payee_fio_address}</KText>
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>{decryptedContent.chain_code} Address: {decryptedContent.payee_public_address}</KText>
        <View style={styles.qrcode}>
          <QRCode value={decryptedContent.payee_public_address} size={200}/>
        </View>
        <View style={styles.spacer} />
        <KButton
          title={'Accept and pay'}
          theme={'blue'}
          style={styles.button}
          icon={'check'}
          onPress={_handleAccept}
        />
        <KButton
          title={'Reject'}
          theme={'brown'}
          style={styles.button}
          icon={'check'}
          onPress={_handleReject}
        />
      </View>
    </SafeAreaView>
    );
  } else if (payerRole && chain) {
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
        <KHeader title={title} subTitle={getRequestTitle()} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Payer: {fioRequest.payer_fio_address}</KText>
        <KText>Payee: {fioRequest.payee_fio_address}</KText>
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>{decryptedContent.chain_code} Address: {decryptedContent.payee_public_address}</KText>
        <View style={styles.qrcode}>
          <QRCode value={decryptedContent.payee_public_address} size={200}/>
        </View>
        <View style={styles.spacer} />
        <KText style={styles.errorMessage}>You have no imported {decryptedContent.chain_code} accounts to pay.</KText>
        <KButton
          title={'Connect account'}
          theme={'blue'}
          style={styles.button}
          onPress={() => navigate('ConnectAccount')}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
          )}
        />
        <KButton
          title={'Reject'}
          theme={'brown'}
          style={styles.button}
          icon={'check'}
          onPress={_handleReject}
        />
      </View>
    </SafeAreaView>
    );
  } else if (payerRole) {
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
        <KHeader title={title} subTitle={getRequestTitle()} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Payer: {fioRequest.payer_fio_address}</KText>
        <KText>Payee: {fioRequest.payee_fio_address}</KText>
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>{decryptedContent.chain_code} Address: {decryptedContent.payee_public_address}</KText>
        <View style={styles.qrcode}>
          <QRCode value={decryptedContent.payee_public_address} size={200}/>
        </View>
        <View style={styles.spacer} />
        <KText style={styles.errorMessage}>This wallet does not support {decryptedContent.chain_code} accounts.</KText>
        <KText>You can send transfer to above address from any other wallet and mark request as paid (or reject).</KText>
        <KButton
          title={'Accept and mark paid'}
          theme={'blue'}
          style={styles.button}
          icon={'check'}
          onPress={_handleAccept}
        />
        <KButton
          title={'Reject'}
          theme={'brown'}
          style={styles.button}
          icon={'check'}
          onPress={_handleReject}
        />
      </View>
    </SafeAreaView>
    );
  } else { // My account is Payee - passive view
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
        <KHeader title={title} subTitle={getRequestTitle()} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Payer: {fioRequest.payer_fio_address}</KText>
        <KText>Payee: {fioRequest.payee_fio_address}</KText>
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>Status: {fioRequest.status}</KText>
        <KText>{decryptedContent.chain_code} Address: {decryptedContent.payee_public_address}</KText>
        <View style={styles.spacer} />
        <View style={styles.qrcode}>
          <QRCode value={decryptedContent.payee_public_address} size={200}/>
        </View>
      </View>
    </SafeAreaView>
    );
  }


};

export default connectAccounts()(ViewFIORequestScreen);
