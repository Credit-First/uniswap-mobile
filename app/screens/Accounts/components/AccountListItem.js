import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import CheckBox from 'react-native-check-box';
import { KText } from '../../../components';
import { getChain } from '../../../eos/chains';
import { getAccount } from '../../../eos/eos';
import { log } from '../../../logger/logger';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const fioDivider = 1000000000;
const algoDivider = 1000000;

const loadAccountBalance = async (account, setAccountBalance) => {
  const chain = getChain(account.chainName);
  if (!chain) {
    return;
  }
  try {
    const accountInfo = await getAccount(account.accountName, chain);
    setAccountBalance(accountInfo.core_liquid_balance);
  } catch (err) {
    log({ description: 'loadAccountBalance', cause: err, location: 'AccountListItem'});
    return;
  }
};

const loadFioAccountBalance = async (account, setAccountBalance) => {
  try {
    const pubkey = Ecc.privateToPublic(account.privateKey);
    fetch('http://fio.eostribe.io/v1/chain/get_fio_balance', {
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
        description: 'loadFioAccountBalance - fetch http://fio.eostribe.io/v1/chain/get_fio_balance',
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

const _blank = () => {};

const AccountListItem = ({ account, onPress, onCheck, checked, ...props }) => {
  const [accountBalance, setAccountBalance] = useState();

  if (account.chainName === 'FIO') {
    loadFioAccountBalance(account, setAccountBalance);
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <CheckBox
            value={true}
            disabled={false}
            onClick={onCheck}
            isChecked={checked}
            checkBoxColor={PRIMARY_BLUE}
          />
          <View style={styles.contentContainer}>
            <KText style={styles.chainName}>{account.chainName} : {account.address}, {accountBalance}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (account.chainName === 'ALGO') {
    loadAlgoAccountBalance(account, setAccountBalance);
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <CheckBox
            value={true}
            disabled={false}
            onClick={onCheck}
            isChecked={checked}
            checkBoxColor={PRIMARY_BLUE}
          />
          <View style={styles.contentContainer}>
            <KText style={styles.chainName}>{account.chainName} : {account.accountName}, {accountBalance}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (onCheck) {
    loadAccountBalance(account, setAccountBalance);
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <CheckBox
            value={true}
            disabled={false}
            onClick={onCheck}
            isChecked={checked}
            checkBoxColor={PRIMARY_BLUE}
          />
          <View style={styles.contentContainer}>
            <KText style={styles.chainName}>{account.chainName} : {account.accountName}, {accountBalance}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, props.style]}>
          <View style={styles.contentContainer}>
            <KText style={styles.chainName}>{account.chainName} : {account.accountName}</KText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    color: PRIMARY_BLACK,
  },
  accountName: {
    fontSize: 16,
    color: PRIMARY_GRAY,
  },
});

export default AccountListItem;
