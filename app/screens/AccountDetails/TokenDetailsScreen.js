import React, { useState } from 'react';
import { SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import { KHeader, KButton, KText, KInput, RequestSendButtons } from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain, getEndpoint } from '../../eos/chains';
import { getBalance, transferToken } from '../../eos/tokens';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger'


const TokenDetailsScreen = props => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [toAccountName, setToAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [toActor, setToActor] = useState('');
  const [toPubkey, setToPubkey] = useState('');
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    navigation: { navigate, goBack },
    route: {
      params: {
        account: account,
        token: token,
       },
    },
    accountsState: { accounts },
  } = props;

  const chainCode = (account.chainName === 'Telos') ? 'TLOS' : account.chainName;
  const fioEndpoint = getEndpoint('FIO');

  const handleTokenBalance = (jsonArray) => {
    if(jsonArray && jsonArray.length > 0) {
      setTokenBalance(jsonArray[0]);
    } else {
      setTokenBalance('0 ' + token.name);
    }
  }

  const _validateAddress = address => {
    if (address.length >= 3 && address.indexOf('@') > 0 && address.indexOf('@') < address.length-1) {
      fetch(fioEndpoint + '/v1/chain/avail_check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_name: address,
        }),
      })
        .then(response => response.json())
        .then(json => updateAvailableState(json.is_registered, address))
        .catch(error => updateAvailableState(-1, address, error));
    }
  };

  const updateAvailableState = (regcount, address, error) => {
    if (regcount === 0) {
      setAddressInvalidMessage('Invalid FIO address!');
      setToPubkey('');
    } else if (regcount === 1) {
      setAddressInvalidMessage('');
      loadToPubkey(address);
    } else if (error) {
      setToPubkey('');
      setAddressInvalidMessage('Error validating FIO address');
      log({
        description: '_validateAddress - fetch ' + fioEndpoint + '/v1/chain/avail_check',
        cause: error,
        location: 'TokenDetailsScreen'
      });
    }
  };

  const loadToPubkey = async address => {
    fetch(fioEndpoint + '/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": address,
        "chain_code": chainCode,
        "token_code": chainCode,
      }),
    })
      .then(response => response.json())
      .then(json => processToPubkeyUpdate(json.public_address))
      .catch(error => log({
        description: 'loadToPubkey - fetch [' + chainCode + '] ' + fioEndpoint + '/v1/chain/get_pub_address ['+address+']',
        cause: error,
        location: 'TokenDetailsScreen'
      })
    );
  };

  const processToPubkeyUpdate = async (toAccountPubkey) => {
    const chain = getChain(chainCode);
    if(chain) { // EOSIO chain
      const [toActorValue, toPubkeyValue] = toAccountPubkey.split(',');
      const toAccountInfo = await getAccount(toActorValue, chain);
      if (!toAccountInfo) {
        Alert.alert('Error fetching account data for '+toActor+' on chain '+chainCode);
        return;
      }
      setToActor(toActorValue);
      setToPubkey(toPubkeyValue);
    } else { // Non EOSIO chain - no 'actor,pubkey' split
      setToActor('');
      setToPubkey(toAccountPubkey);
    }
  }

  const _handleToAccountChange = value => {
    setToAccountName(value);
    // If FIO addreess
    if(value.indexOf('@') > 0) {
      _validateAddress(value);
    }
  };

  const getSubtitle = () => {
    return token.name + ' on ' + account.chainName + ': ' + token.contract;
  };

  const _handleFIORequest = () => {
    navigate('FIORequest');
  };

  const _handleFIOSend = () => {
    navigate('FIOSend');
  };

  const _handleTransfer = async () => {
    let toAccount = toAccountName;
    if(toAccount.indexOf('@') > 0 && toActor) {
      toAccount = toActor;
    } else { // Validate account:
      const chain = getChain(chainCode);
      const toAccountInfo = await getAccount(toAccount, chain);
      if (!toAccountInfo) {
        Alert.alert('Error fetching account data for '+toAccount+' on chain '+chainCode);
        return;
      }
    }
    const res = await transferToken(toAccount, parseFloat(amount), memo, account, token);
    if (res && res.transaction_id) {
      Alert.alert('Token transfer sent in tx '+res.transaction_id);
      goBack();
    } else {
      let error = {
        description: 'Failed _handleTransfer',
        method: 'transferToken',
        location: 'TokenDetailsScreen',
        cause: res,
        fromAccount: account.accountName,
        toAccount: toAccount,
        amount: parseFloat(amount),
        token: token
      };
      log(error);
      Alert.alert("Token transfer failed.");
    }
  };

  const getTransferFormLabel = () => {
    return 'Transfer '+token.name+' tokens: ';
  };

  getBalance(account.accountName, token, handleTokenBalance);

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
        <KHeader title={account.accountName} subTitle={getSubtitle()} style={styles.header} />
        <KText>Balance: {tokenBalance}</KText>
        <KInput
          label={getTransferFormLabel()}
          placeholder={'Enter receiver account name'}
          value={toAccountName}
          onChangeText={_handleToAccountChange}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
        <KInput
          placeholder={'Enter amount to send'}
          value={amount}
          onChangeText={setAmount}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
          keyboardType={'numeric'}
        />
        <KInput
          placeholder={'Optional message'}
          value={memo}
          onChangeText={setMemo}
          containerStyle={styles.inputContainer}
          autoCapitalize={'none'}
        />
        <KButton
          title={'Submit transfer'}
          theme={'blue'}
          style={styles.button}
          onPress={_handleTransfer}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/transfer.png')}
              style={styles.buttonIcon}
            />
          )}
        />
        <RequestSendButtons
            style={styles.request_send_button}
            onRequestPress={_handleFIORequest}
            onSendPress={_handleFIOSend}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/transfer.png')}
              style={styles.buttonIcon}
            />
            )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(TokenDetailsScreen);
