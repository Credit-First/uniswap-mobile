import React, { useState } from 'react';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './TransferScreen.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { sendFioTransfer } from '../../eos/fio';
import { submitAlgoTransaction } from '../../algo/algo';
import { getChain, getEndpoint } from '../../eos/chains';
import { log } from '../../logger/logger';


const TransferScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccountName, setToAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isFioAddress, setIsFioAddress] = useState(false);
  const [toActor, setToActor] = useState('');
  const [toPubkey, setToPubkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    accountsState: { accounts, activeAccountIndex },
    navigation: { navigate },
  } = props;

  const fioEndpoint = getEndpoint('FIO');

  const processToPubkeyUpdate = async (toAccountPubkey) => {
    const chain = getChain(fromAccount.chainName);
    if(chain && chain.name === 'FIO') {
      setToActor('');
      setToPubkey(toAccountPubkey);
    } else if(chain) { // EOSIO chain
      const [toActorValue, toPubkeyValue] = toAccountPubkey.split(',');
      const toAccountInfo = await getAccount(toActorValue, chain);
      if (!toAccountInfo) {
        Alert.alert('Error fetching account data for '+toActor+' on chain '+fromAccount.chainName);
        return;
      }
      setToActor(toActorValue);
      setToPubkey(toPubkeyValue);
    } else { // Non EOSIO chain - no 'actor,pubkey' split
      setToActor('');
      setToPubkey(toAccountPubkey);
    }
  }

  const loadToPubkey = async address => {
    let chainCode = (fromAccount.chainName === 'Telos') ? 'TLOS' : fromAccount.chainName;
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
        description: 'loadToPubkey - fetch ' + fioEndpoint + '/v1/chain/get_pub_address',
        cause: error,
        location: 'TransferScreen'
      })
    );
  };

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
      console.log(error);
      setToPubkey('');
      setAddressInvalidMessage('Error validating FIO address');
      log({
        description: '_validateAddress - fetch ' + fioEndpoint + '/v1/chain/avail_check',
        cause: error,
        location: 'TransferScreen'
      });
    }
  };

  const _handleFromAccountChange = value => {
    setFromAccount(value);
  };

  const _handleToAccountChange = value => {
    if(!fromAccount) {
      Alert.alert('Select from account first!');
      return;
    }
    if (fromAccount.chainName==='FIO') {
      _validateAddress(value);
      setIsFioAddress(true);
    } else if(value.indexOf('@') > 1) {
      _validateAddress(value);
      setIsFioAddress(true);
    } else {
      setIsFioAddress(false);
      setAddressInvalidMessage('');
    }
    setToAccountName(value);
  }

  const _callback = (txid) => {
    Alert.alert('Transfer completed: '+txid);
  }

  const _handleTransfer = async () => {
    if(!fromAccount || !toAccountName || !amount) {
      Alert.alert('Please select from and to account as well as amount for transfer');
      return;
    }

    // Validate amount:
    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
      return;
    }

    // EOSIO chain (undefined for not EOSIO account)
    let chain = getChain(fromAccount.chainName);

    // If to account is FIO address:
    if(isFioAddress) {
      if(!toPubkey) {
        await _validateAddress(toAccountName);
      }
      if(!toPubkey) {
        Alert.alert('Could not determine receiver public key for '+fromAccount.chainName+' registered to '+toAccountName);
        return;
      }
    }

    // EOSIO to actor name validation:
    let actorName = (isFioAddress) ? toActor : toAccountName;
    if(chain && chain.name !== 'FIO') {
      try {
        let toAccount = await getAccount(actorName, chain);
        if (!toAccount) {
          Alert.alert('Please input valid account name');
          return;
        }
      } catch (e) {
        Alert.alert('Please input valid account name');
        return;
      }
    }

    setLoading(true);
    // From account validation
    try {
      if(fromAccount.chainName === 'ALGO') {
        let receiver = (toPubkey) ? toPubkey : toAccountName;
        await submitAlgoTransaction(fromAccount, receiver, floatAmount, memo, _callback);
      } else if(fromAccount.chainName === 'FIO') {
        await sendFioTransfer(fromAccount, toPubkey, floatAmount, memo, _callback);
      } else if(chain) { // Any of supported EOSIO chains:
        await transfer(actorName, floatAmount, memo, fromAccount, chain);
        Alert.alert('Transfer completed!');
      } else {
        Alert.alert('Unsupported transfer state!');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert(err.message);
      log({
        description: '_handleTransfer - transfer: '+fromAccount.chainName,
        cause: err.message,
        location: 'ViewFIORequestScreen'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <KHeader
            title={'Transfer coins'}
            subTitle={'Move funds to another account'}
            style={styles.header}
          />
          <KSelect
            label={'From account'}
            items={accounts.map(item => ({
              label: `${item.chainName}: ${(item.chainName!=='FIO')?item.accountName:item.address}`,
              value: item,
            }))}
            onValueChange={_handleFromAccountChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Sending to'}
            placeholder={'Enter either direct or FIO address'}
            value={toAccountName}
            onChangeText={_handleToAccountChange}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <KText style={styles.errorMessage}>{addressInvalidMessage}</KText>
          <KInput
            label={'Amount to send to'}
            placeholder={'Enter amount to send'}
            value={amount}
            onChangeText={setAmount}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
          />
          <KInput
            label={'Personal note'}
            placeholder={'Enter your message'}
            value={memo}
            onChangeText={setMemo}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
          />
          <View style={styles.spacer} />
          <KButton
            title={'Submit transfer'}
            theme={'blue'}
            style={styles.button}
            isLoading={loading}
            renderIcon={() => (
              <Image
                source={require('../../../assets/icons/transfer.png')}
                style={styles.buttonIcon}
              />
            )}
            onPress={_handleTransfer}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(TransferScreen);
