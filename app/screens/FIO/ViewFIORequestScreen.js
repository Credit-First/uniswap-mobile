import React, { useState, useEffect } from 'react';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import QRCode from 'react-native-qrcode-svg';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './FIORequestSend.style';
import { KHeader, KButton, KText, KInput } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { getAccount, transfer } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { rejectFundsRequest, recordObtData } from '../../eos/fio';

const ViewFIORequestScreen = props => {
  const [transactionId, setTransactionId] = useState('');
  const [memo, setMemo] = useState('');
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const getFee = async address => {
    fetch('http://fio.eostribe.io/v1/chain/get_fee', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        end_point: 'add_pub_address',
        fio_address: address,
      }),
    })
      .then(response => response.json())
      .then(json => setFee(json.fee))
      .catch(error => console.error(error));
  };

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
    getFee(fioAccount.address);
  }

  const markFIORequestCompleted = async (transferId) => {
    try {
      const res = await recordObtData(fioAccount,
        fioRequest.payee_fio_address,
        fioRequest.payee_fio_public_key,
        decryptedContent.chain_code,
        decryptedContent.amount,
        fioRequest.fio_request_id,
        transferId,
        decryptedContent.memo,
        fee);
      Alert.alert("FIO Request processed!");
      goBack();
    } catch(e) {
      Alert.alert(e.message);
    }
  };

  const handleFromToAccountTransfer = async (chainName, toAccountName, actorPubkey) => {
    const [actor, pubkey] = actorPubkey.split(',');
    try {
      // Load chain info:
      const chain = getChain(chainName);
      // Load account info:
      const fromAccountInfo = await getAccount(actor, chain);
      if (!fromAccountInfo) {
        Alert.alert('Error fetching account data for '+actor+' on chain '+chainName);
        return;
      }
      const activeAccounts = accounts.filter((value, index, array) => {
        return value.accountName === actor && value.chainName === chain.name;
      });
      if (activeAccounts[0] < 1) {
        Alert.alert('Could not find matching account to send transfer from in this wallet');
        return;
      }
      // Check amount
      const floatAmount = parseFloat(decryptedContent.amount);
      if (isNaN(floatAmount)) {
        Alert.alert('Invalid transfer amount '+floatAmount);
        return;
      }
      // Now do transfer:
      setLoading(true);
      try {
        const res = await transfer(toAccountName,
          floatAmount,
          decryptedContent.memo,
          activeAccounts[0],
          chain);
        //console.log(res);
        if (res && res.transaction_id) {
          markFIORequestCompleted(res.transaction_id);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Alert.alert(e.message);
      }

    } catch (e) {
      Alert.alert('Error: '+e);
      console.log(e);
      return;
    }
  };

  const handleToAccountAddress = async (chainName, actorPubkey) => {
    const [actor, pubkey] = actorPubkey.split(',');
    try {
      const toAccount = await getAccount(actor, chain);
      if (!toAccount) {
        Alert.alert('Error fetching account data for '+actor+' on chain '+chainName);
        return;
      }
      // Now load corresponding from account
      fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "fio_address": fioAccount.address,
          "chain_code": chainName,
          "token_code": chainName
        }),
      })
      .then(response => response.json())
      .then(json => handleFromToAccountTransfer(chainName, actor, json.public_address))
      .catch(error => Alert.alert('Error fetching payer public address for '+chainName));

    } catch (e) {
      Alert.alert('Error: '+e);
      console.log(e);
      return;
    }
  };

  const _handleTransferAndAccept = async () => {
    const chainName = decryptedContent.chain_code
    const toFioAddress = decryptedContent.payee_public_address;
    fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": toFioAddress,
        "chain_code": chainName,
        "token_code": chainName
      }),
    })
    .then(response => response.json())
    .then(json => handleToAccountAddress(chainName, json.public_address))
    .catch(error => Alert.alert('Error fetching payee public address for '+chainName));
  };

  const _handleExternalAccept = async () => {
    try {
      const res = await recordObtData(fioAccount,
        fioRequest.payee_fio_address,
        fioRequest.payee_fio_public_key,
        decryptedContent.chain_code,
        decryptedContent.amount,
        fioRequest.fio_request_id,
        transactionId,
        memo,
        fee);
        //console.log(res);
      Alert.alert("Request processed!");
      goBack();
    } catch(e) {
      Alert.alert(e.message);
    }
  };

  const _handleReject = async () => {
    try {
      const res = await rejectFundsRequest(fioAccount, fioRequest.fio_request_id, fee);
      Alert.alert("Request rejected!");
      goBack();
    } catch(e) {
      Alert.alert(e.message);
    }
  };

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
          title={'Pay and accept'}
          theme={'blue'}
          style={styles.button}
          icon={'check'}
          isLoading={loading}
          onPress={_handleTransferAndAccept}
        />
        <KButton
          title={'Reject'}
          theme={'brown'}
          style={styles.button}
          icon={'check'}
          isLoading={loading}
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
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>{decryptedContent.chain_code} Address: {decryptedContent.payee_public_address}</KText>
        <View style={styles.qrcode}>
          <QRCode value={decryptedContent.payee_public_address} size={150}/>
        </View>
        <KText style={styles.errorMessage}>This wallet does not support {decryptedContent.chain_code} accounts.</KText>
        <KText>You can send transfer to above address from any other wallet and mark request as paid (or reject).</KText>
        <KInput
          label={'Transaction Id'}
          placeholder={'Enter transaction id (if available)'}
          value={transactionId}
          multiline={true}
          onChangeText={setTransactionId}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KInput
          label={'Memo'}
          placeholder={'Enter memo'}
          value={memo}
          multiline={true}
          onChangeText={setMemo}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KButton
          title={'Accept and mark paid'}
          theme={'blue'}
          style={styles.button}
          icon={'check'}
          onPress={_handleExternalAccept}
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
