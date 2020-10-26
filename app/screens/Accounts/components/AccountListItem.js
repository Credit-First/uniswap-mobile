import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import CheckBox from 'react-native-check-box';
import { KText } from '../../../components';
import { getChain, getEndpoint } from '../../../eos/chains';
import { getBalance } from '../../../eos/tokens';
import { getAccount } from '../../../eos/eos';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const fioDivider = 1000000000;
const algoDivider = 1000000;

const fioEndpoint = getEndpoint('FIO');

const { height, width } = Dimensions.get('window');
var chainWidth = width - 80;

const loadAccountBalance = async (account, setAccountBalance) => {
  const chain = getChain(account.chainName);
  if (!chain) {
    return;
  }
  try {
    const accountInfo = await getAccount(account.accountName, chain);
    if(accountInfo.core_liquid_balance) {
      setAccountBalance(accountInfo.core_liquid_balance);
    } else {
      setAccountBalance('0 '+chain.symbol);
    }
  } catch (err) {
    log({ description: 'loadAccountBalance', cause: err, location: 'AccountListItem'});
    return;
  }
};


const loadFioAccountBalance = async (account, setAccountBalance) => {
  try {
    const pubkey = Ecc.privateToPublic(account.privateKey);
    fetch(fioEndpoint+'/v1/chain/get_fio_balance', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_public_key: pubkey,
      }),
    })
      .then(response => response.json())
      .then(json => setAccountBalance(((json.balance!==undefined) ? (parseFloat(json.balance)/fioDivider).toFixed(4) + ' FIO' : 'validate')))
      .catch(error => log({
        description: 'loadFioAccountBalance - fetch '+fioEndpoint+'/v1/chain/get_fio_balance',
        cause: error,
        location: 'AccountListItem'
      })
    );
  } catch (err) {
    log({ description: 'loadFioAccountBalance', cause: err, location: 'AccountListItem'});
    return;
  }
};

const loadAlgoAccountBalance = async (account, setAccountBalance) => {
  try {
    const addr = account.account.addr;
    fetch('http://algo.eostribe.io/v1/account/'+addr, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => setAccountBalance( (parseFloat(json.amount)/algoDivider).toFixed(4) + ' ALGO'))
      .catch(error => log({
        description: 'loadAlgoAccountBalance - fetch https://algo.eostribe.io/v1/account/'+addr,
        cause: error,
        location: 'AccountListItem'
      })
    );
  } catch (err) {
    log({ description: 'loadAlgoAccountBalance', cause: err, location: 'AccountListItem'});
    return;
  }
};

const AccountListItem = ({ account, onPress, onTokenPress, ...props }) => {
  const [accountBalance, setAccountBalance] = useState();
  const [count, setCount] = useState(0);

  const refreshBalances = () => {
    //console.log('Refreshing balances');
    if (account.chainName === 'FIO') {
      loadFioAccountBalance(account, setAccountBalance);
    } else if (account.chainName === 'ALGO') {
      loadAlgoAccountBalance(account, setAccountBalance);
    } else {
      loadAccountBalance(account, setAccountBalance);
    }
    setCount(1);
  };

  const handleOnTokensPress = (index) => {
    setCount(0);
    onTokenPress(index);
  }

  const handleOnPress = (index) => {
    setCount(0);
    refreshBalances();
    onPress(index);
  }

  if(count === 0) {
    refreshBalances();
  }

  if (account.chainName === 'FIO') {
    return (
      <View onFocus={refreshBalances} style={styles.rowContainer}>
        <View style={[styles.container, props.style]}>
        <TouchableOpacity onPress={handleOnPress}>
          <KText style={styles.chainName}>{account.chainName} : {account.address}, {accountBalance}</KText>
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshBalances}>
          <Icon name={'refresh'} size={25} color="#000000" />
        </TouchableOpacity>
        </View>
      </View>
    );
  } else if (account.chainName === 'ALGO') {
    return (
      <View onFocus={refreshBalances} style={styles.rowContainer}>
        <View style={[styles.container, props.style]}>
        <TouchableOpacity onPress={handleOnPress}>
          <KText style={styles.chainName}>{account.chainName} : {account.accountName}, {accountBalance}</KText>
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshBalances}>
          <Icon name={'refresh'} size={25} color="#000000" />
        </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    if(account.tokens && account.tokens.length > 0) {
      return (
        <View>
          <View onFocus={refreshBalances} style={styles.rowContainer}>
            <View style={[styles.container, props.style]}>
              <TouchableOpacity onPress={handleOnPress}>
                <KText style={styles.chainName}>{account.chainName} : {account.accountName}, {accountBalance}</KText>
              </TouchableOpacity>
              <TouchableOpacity onPress={refreshBalances}>
                <Icon name={'refresh'} size={25} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleOnTokensPress}>
            <View style={[styles.container, props.style]}>
              <View style={styles.contentContainer}>
                <KText style={styles.tokenName}> + {account.tokens.length} Tokens</KText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View onFocus={refreshBalances} style={styles.rowContainer}>
          <View style={[styles.container, props.style]}>
            <TouchableOpacity onPress={handleOnPress}>
              <KText style={styles.chainName}>{account.chainName} : {account.accountName}, {accountBalance}</KText>
            </TouchableOpacity>
            <TouchableOpacity onPress={refreshBalances}>
              <Icon name={'refresh'} size={25} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#2A2240',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    borderRadius: 6,
    elevation: 4,
    backgroundColor: '#F1F6FF',
    padding: 5,
  },
  contentContainer: {
    marginLeft: 20,
  },
  chainName: {
    width: chainWidth,
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
  tokenName: {
    fontSize: 15,
    color: PRIMARY_BLUE,
  },
  accountName: {
    fontSize: 16,
    color: PRIMARY_GRAY,
  },
});

export default AccountListItem;
