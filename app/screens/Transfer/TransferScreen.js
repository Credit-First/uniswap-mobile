import React, { useState } from 'react';
import { SafeAreaView, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './TransferScreen.style';
import { KHeader, KButton, KInput, KSelect, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getAccount, transfer } from '../../eos/eos';
import { sendFioTransfer } from '../../eos/fio';
import { submitAlgoTransaction } from '../../algo/algo';
import { getChain } from '../../eos/chains';

const TransferScreen = props => {
  const [fromAccount, setFromAccount] = useState();
  const [toAccountName, setToAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [fioPubkey, setFioPubkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressInvalidMessage, setAddressInvalidMessage] = useState();

  const {
    accountsState: { accounts, activeAccountIndex },
    navigation: { navigate },
  } = props;

  const filteredAccounts = accounts.filter((value, index, array) => {
    return value.chainName !== 'FIO';
  });

  const getFioPubkey = async address => {
    fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "fio_address": address,
        "chain_code": "FIO",
        "token_code": "FIO"
      }),
    })
      .then(response => response.json())
      .then(json => setFioPubkey(json.public_address))
      .catch(error => console.log(error));
  }

  const _validateAddress = address => {
    if (address.length >= 3 && address.indexOf('@') > 0 && address.indexOf('@') < address.length-1) {
      fetch('http://fio.eostribe.io/v1/chain/avail_check', {
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
      setAddressInvalidMessage('Invalid address!');
      setFioPubkey('');
    } else if (regcount === 1) {
      setAddressInvalidMessage('');
      getFioPubkey(address);
    } else if (error) {
      console.error(error);
      setFioPubkey('');
      setAddressInvalidMessage('Error validating address');
    }
  };

  const _handleFromAccountChange = value => {
    setFromAccount(value);
  };

  const _handleToAccountChange = value => {
    if (fromAccount.chainName==='FIO') {
      _validateAddress(value);
    }
    setToAccountName(value);
  }

  const _handleTransfer = async () => {
    const activeAccount = accounts[activeAccountIndex];
    if (!activeAccount) {
      return;
    }

    if(activeAccount.chainName!=='ALGO') {
      const chain = getChain(activeAccount.chainName);
      if (!chain) {
        return;
      }
      try {
        const toAccount = await getAccount(toAccountName, chain);
        if (!toAccount) {
          Alert.alert('Please input valid account name');
          return;
        }
      } catch (e) {
        Alert.alert('Please input valid account name');
        return;
      }
    }

    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount)) {
      Alert.alert('Please input valid amount');
      return;
    }

    setLoading(true);
    try {
      if(!fromAccount) {
        fromAccount = activeAccount;
      }
      const account = fromAccount;
      if(fromAccount.chainName==='ALGO') {
        submitAlgoTransaction(fromAccount, toAccountName, floatAmount, memo);
        navigate('Transactions', { account });
      } else if (fromAccount.chainName==='FIO') {
        if(!fioPubkey) {
          Alert.alert('Could not determine receiver FIO public key - check FIO address');
          return;
        }
        Alert.alert("Currently FIO transfers are not allowed!");
        //sendFioTransfer(fromAccount, fioPubkey, floatAmount, memo);
      } else { // Any of EOSIO chains:
        await transfer(toAccountName, floatAmount, memo, fromAccount, chain);
        navigate('Transactions');
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Alert.alert(e.message);
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
            items={filteredAccounts.map(item => ({
              label: `${item.chainName}: ${(item.chainName!=='FIO')?item.accountName:item.address}`,
              value: item,
            }))}
            onValueChange={_handleFromAccountChange}
            containerStyle={styles.inputContainer}
          />
          <KInput
            label={'Sending to'}
            placeholder={'Enter username to send to'}
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
