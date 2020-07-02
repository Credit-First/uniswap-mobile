import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import CheckBox from 'react-native-check-box';
import { KText } from '../../../components';
import { getChain } from '../../../eos/chains';
import { getAccount } from '../../../eos/eos';
import {
  PRIMARY_GRAY,
  PRIMARY_BLACK,
  PRIMARY_BLUE,
} from '../../../theme/colors';

const loadAccountBalance = async (account, setAccountBalance) => {
  const chain = getChain(account.chainName);
  if (!chain) {
    return;
  }
  try {
    const accountInfo = await getAccount(account.accountName, chain);
    setAccountBalance(accountInfo.core_liquid_balance);
  } catch (e) {
    console.log('Error: ' + e);
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
      .then(json => setAccountBalance(((json.balance!==undefined)?json.balance+' FIO':'validate')))
      .catch(error => console.error(error));
  } catch (e) {
    console.log('Error: ' + e);
    return;
  }
};

const loadAlgoAccountBalance = async (account, setAccountBalance) => {
  try {
    const addr = account.account.addr;
    fetch('https://algo.eostribe.io/v1/account/'+addr, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => setAccountBalance(parseFloat(json.amount)/1000000 + ' ALGO'))
      .catch(error => console.log(error));
  } catch (e) {
    console.log('Error: ' + e);
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
