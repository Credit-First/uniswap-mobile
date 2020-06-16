import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  // Linking,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { fioAddPublicAddress } from '../../eos/fio';
import styles from './RegisterAddress.style';
import { KHeader, KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import AccountListItem from '../Accounts/components/AccountListItem';



const FIOAddressActionsScreen = props => {
  const [fioRegistrationContent, setFioRegistrationContent] = useState();
  const [executionCount, setExecutionCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [buttonColor, setButtonColor] = useState('grey');
  const [fioBalance, setFioBalance] = useState(0.0);
  const [actor, setActor] = useState();
  const [fioFee, setFioFee] = useState(0);
  var initialConnectedAccounts = [];
  var initialFilteredAccounts = [];
  const [connectedHeader, setConnectedHeader] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [filteredHeader, setFilteredHeader] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(initialFilteredAccounts);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { account: fioAccount },
    },
    deleteAccount,
    accountsState: { accounts },
  } = props;

  const privateKey = fioAccount.privateKey;
  const fioKey = Ecc.privateToPublic(privateKey);
  fioAccount.accountName = actor;

  const checkRegPubkey = async account => {
    console.log('Checking registered pubkey for ' + account.chainName + ": " + account.accountName);
    var chainName = account.chainName;
    if(chainName == "Telos") {
      chainName = "TLOS";
    }
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
      .then(json => updateAccountLists(account, json.public_address))
      .catch(error => console.log(error));
  }


  const updateAccountLists = (account, regPubkey) => {
    const accPubkey = ecc.privateToPublic(account.privateKey);
    //console.log(accPubkey + " == " + regPubkey);
    if (accPubkey == regPubkey) {
      account.title = 'Connected '  + account.chainName + ': ' + account.accountName;
      if (connectedHeader == '') {
        setConnectedHeader('Connected accounts to the address:');
      }
      var newConnectedAccounts = [...initialConnectedAccounts , account ];
      initialConnectedAccounts.push(account);
      setConnectedAccounts(newConnectedAccounts);
    } else {
      account.title = 'Connect '  + account.chainName + ': ' + account.accountName;
      if (filteredHeader == '') {
        setFilteredHeader('Connect following accounts to the address:');
      }
      var newFilteredAccounts = [...initialFilteredAccounts , account ];
      initialFilteredAccounts.push(account);
      setFilteredAccounts(newFilteredAccounts);
    }
  }

  const _handleConnectAccountToAddress = async account => {
    try {
      const res = await fioAddPublicAddress(fioAccount, account, fioFee);
      console.log(res);
      Alert.alert("Successfully added!");
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const checkRegistration = pubkey => {
    if (executionCount > 0) {
      return;
    }
    console.log('Check registration for ' + pubkey);
    setExecutionCount(1);
    fetch('http://fio.eostribe.io/v1/chain/get_fio_names', {
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
      .then(json => updateFioRegistration(json.fio_addresses))
      .catch(error => console.log(error));
  };

  const getFioBalance = pubkey => {
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
      .then(json => setFioBalance(json.balance))
      .catch(error => console.error(error));
  };

  const getFee = address => {
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
      .then(json => setFioFee(json.fee))
      .catch(error => console.error(error));
  };

  const loadActor = pubkey => {
    fetch('http://fio.eostribe.io/v1/chain/get_actor', {
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
      .then(json => setActor(json.actor))
      .catch(error => console.error(error));
  };

  const updateFioRegistration = fioAddresses => {
    if (fioAddresses) {
      var content = fioAddresses.map(function(item) {
        if (fioAccount.address !== item.fio_address) {
          fioAccount.address = item.fio_address;
        }
        return item.fio_address + ' expires ' + item.expiration;
      });
      setRegistered(true);
      setButtonColor('primary');
      setFioRegistrationContent(content);
      getFioBalance(fioKey);
      getFee(fioAccount.address);
      loadActor(fioKey);
        accounts.map((value, index, array) => {
          if (value.chainName !== 'FIO')  {
            checkRegPubkey(value); 
          }
        });
    } else {
      setRegistered(false);
      setButtonColor('gray');
      setFioRegistrationContent('Unregistered address');
    }
  };

  const _handleRemoveAccount = () => {
    const index = findIndex(
      accounts,
      el =>
        el.address === fioAccount.address &&
        el.chainName === fioAccount.chainName,
    );
    deleteAccount(index);
    goBack();
  };

  const _handlePressAccount = index => {
    const account = accounts[index];
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

  checkRegistration(fioKey);


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
        <KHeader title={fioAccount.address} style={styles.header} />
        <KText>{fioKey}</KText>
        <KText>Actor: {actor}</KText>
        <KText>Balance: {fioBalance} FIO</KText>
        <KText>Connect fee: {fioFee} FIO</KText>
        <KText>{fioRegistrationContent}</KText>
        <View style={styles.spacer} />
        <KText>{connectedHeader}</KText>
        <FlatList
          data={connectedAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <AccountListItem
              account={item}
              style={styles.listItem}
              onPress={() => _handlePressAccount(index)}
              checked={true}
          />
          )}
        />
        <KText>{filteredHeader}</KText>
        <FlatList
          data={filteredAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <KButton
              title={item.title}
              theme={buttonColor}
              style={styles.button}
              isLoading={!registered}
              icon={'check'}
              onPress={() => _handleConnectAccountToAddress(item)}
            />
          )}
        />
        <KButton
          title={'Remove this FIO address'}
          theme={'brown'}
          style={styles.button}
          icon={'remove'}
          onPress={_handleRemoveAccount}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(FIOAddressActionsScreen);
