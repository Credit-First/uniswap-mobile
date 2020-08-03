import React, { useState, useEffect } from 'react';
import { Fio, Ecc } from '@fioprotocol/fiojs';
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
import { submitAlgoTransaction } from '../../algo/algo';
import { getChain, getEndpoint } from '../../eos/chains';
import { rejectFundsRequest, recordObtData } from '../../eos/fio';
import { log } from '../../logger/logger';


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

  const fioEndpoint = getEndpoint('FIO');

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


  let decryptedContent = null;
  try {
    decryptedContent = cipher.decrypt('new_funds_content', fioRequest.content);
  } catch(err) {
    Alert.alert("Error decrypting FIO Request: "+err);
    log({ description: 'Error decrypting FIO Request', cause: err, location: 'ViewFIORequestScreen'});
  }

  const getRequestTitle = () => {
    return fioRequest.payer_fio_address + ' -> ' + fioRequest.payee_fio_address;
  }

  const getFee = async address => {
    fetch(fioEndpoint+'/v1/chain/get_fee', {
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
      .catch(error => log({
        description: 'getFee - fetch ' + fioEndpoint + '/v1/chain/get_fee',
        cause: error,
        location: 'ViewFIORequestScreen'
      })
    );
  };

  let chain = null;
  if(decryptedContent != null) {
    var chainCode = decryptedContent.chain_code.toUpperCase();
    chain = getChain(chainCode);
    if(!chain && chainCode === 'ALGO') {
      chain = { name: 'ALGO', symbol: 'ALGO' };
    }
  }

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
      var chainCode = decryptedContent.chain_code.toUpperCase();
      const res = await recordObtData(fioAccount,
        fioRequest.payee_fio_address,
        fioRequest.payee_fio_public_key,
        chainCode,
        decryptedContent.amount,
        fioRequest.fio_request_id,
        transferId,
        decryptedContent.memo,
        fee);
      Alert.alert("FIO Request processed!");
      goBack();
    } catch(err) {
      Alert.alert(err.message);
      log({ description: 'markFIORequestCompleted', cause: err, location: 'ViewFIORequestScreen'});
    }
  };

  const doEOSIOTransfer = async (chainName, toAccountPubkey, fromAccountPubkey) => {
    const chain = getChain(chainName);
    // To EOSIO Account record:
    const [toActor, toPubkey] = toAccountPubkey.split(',');
    const toAccountInfo = await getAccount(toActor, chain);
    if (!toAccountInfo) {
      Alert.alert('Error fetching account data for '+toActor+' on chain '+chainName);
      return;
    }
    // From EOSIO Account record:
    const [fromActor, fromPubkey] = fromAccountPubkey.split(',');
    // Load account info:
    const fromAccountInfo = await getAccount(fromActor, chain);
    if (!fromAccountInfo) {
      Alert.alert('Error fetching account data for '+fromActor+' on chain '+chainName);
      return;
    }
    const activeAccounts = accounts.filter((value, index, array) => {
      return value.accountName === fromActor && value.chainName === chainName;
    });
    if (activeAccounts.length === 0) {
      Alert.alert('Could not find matching account to send transfer from in this wallet');
      return;
    }
    const fromAccount = activeAccounts[0];
    // Check amount
    const floatAmount = parseFloat(decryptedContent.amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Invalid transfer amount ' + decryptedContent.amount);
      return;
    }
    setLoading(true);
    try {
      const res = await transfer(toAccountName,
        floatAmount,
        decryptedContent.memo,
        fromAccount,
        chain);
      if (res && res.transaction_id) {
        markFIORequestCompleted(res.transaction_id);
      } else {
  			Alert.alert("Something went wrong: " + res.message);
  		}
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({ description: 'doEOSIOTransfer', cause: err.message, location: 'ViewFIORequestScreen'});
    }
    return;
  };

  const doAlgoTransfer = async (toAccountPubkey, fromAccountPubkey) => {
    // Find imported matching from account:
    const activeAccounts = accounts.filter((value, index, array) => {
      return value.chainName === 'ALGO' && value.account.addr === fromAccountPubkey;
    });
    if (activeAccounts.lnegth === 0) {
      Alert.alert('Could not find imported Algo account to pubkey '+fromAccountPubkey);
      return;
    }
    const fromAccount = activeAccounts[0];
    // Check amount
    const floatAmount = parseFloat(decryptedContent.amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Invalid transfer amount ' + decryptedContent.amount);
      return;
    }
    setLoading(true);
    try {
      await submitAlgoTransaction(fromAccount,
        toAccountPubkey,
        floatAmount,
        decryptedContent.memo,
        markFIORequestCompleted);
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({ description: 'doAlgoTransfer', cause: err.message, location: 'ViewFIORequestScreen'});
    }
    return;
  };

  const handleFromToAccountTransfer = async (chainName, toActorPubkey, fromActorPubkey) => {
    try {
        setLoading(true);
        if (chainName === 'ALGO') {
          doAlgoTransfer(toActorPubkey, fromActorPubkey);
        } else { // Any of EOSIO based chains:
          doEOSIOTransfer(chainName, toActorPubkey, fromActorPubkey);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Alert.alert(err.message);
        log({ description: 'handleFromToAccountTransfer', cause: err.message, location: 'ViewFIORequestScreen'});
      }
  };

  const handleToAccountAddress = async (chainName, toActorPubkey) => {
    try {
      // Now load corresponding from account
      fetch(fioEndpoint+'/v1/chain/get_pub_address', {
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
      .then(json => handleFromToAccountTransfer(chainName, toActorPubkey, json.public_address))
      .catch(error => Alert.alert('Error fetching payer public address for '+chainName));
    } catch (e) {
      Alert.alert('Error: '+e);
      return;
    }
  };

  const _handleTransferAndAccept = async () => {
    const chainName = decryptedContent.chain_code.toUpperCase();
    const toFioAddress = decryptedContent.payee_public_address;
    fetch(fioEndpoint+'/v1/chain/get_pub_address', {
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
      const chainCode = decryptedContent.chain_code.toUpperCase();
      const res = await recordObtData(fioAccount,
        fioRequest.payee_fio_address,
        fioRequest.payee_fio_public_key,
        chainCode,
        decryptedContent.amount,
        fioRequest.fio_request_id,
        transactionId,
        memo,
        fee);
      Alert.alert("Request processed!");
      goBack();
    } catch(err) {
      Alert.alert(err.message);
      log({ description: '_handleExternalAccept', cause: err.message, location: 'ViewFIORequestScreen'});
    }
  };

  const _handleReject = async () => {
    try {
      const res = await rejectFundsRequest(fioAccount, fioRequest.fio_request_id, fee);
      Alert.alert("Request rejected!");
      goBack();
    } catch(err) {
      Alert.alert(err.message);
      log({ description: '_handleReject', cause: err.message, location: 'ViewFIORequestScreen'});
    }
  };

  if(decryptedContent!=null && payerRole && chain && chainAccounts.length > 0) {
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
        <KText>Address: {decryptedContent.payee_public_address}</KText>
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
  } else if (decryptedContent!=null && payerRole && chain) {
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
        <KText>Address: {decryptedContent.payee_public_address}</KText>
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
  } else if (decryptedContent!=null && payerRole) {
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
        <KText>Address: {decryptedContent.payee_public_address}</KText>
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
  } else if(decryptedContent!=null && decryptedContent.offline_url) { // Private key delegate:
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
        <KHeader title={'Delegated Key Request'} subTitle={decryptedContent.offline_url} style={styles.header} />
        <View style={styles.spacer} />
        <KText>Payer: {fioRequest.payer_fio_address}</KText>
        <KText>Payee: {fioRequest.payee_fio_address}</KText>
        <KText>Amount: {decryptedContent.amount} {decryptedContent.token_code}</KText>
        <KText>Memo: {decryptedContent.memo}</KText>
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>Status: {fioRequest.status}</KText>
        <KText>Address: {decryptedContent.payee_public_address}</KText>
      </View>
    </SafeAreaView>
    );
  } else if(decryptedContent!=null) { // My account is Payee - passive view
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
        <KText>Address: {decryptedContent.payee_public_address}</KText>
      </View>
    </SafeAreaView>
    );
  } else {
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
        <KText>Timestamp: {fioRequest.time_stamp}</KText>
        <KText>Status: {fioRequest.status}</KText>
        <KText>Error: Unable to decrypt FIO Request content!</KText>
      </View>
    </SafeAreaView>
    );
  }


};

export default connectAccounts()(ViewFIORequestScreen);
