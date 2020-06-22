import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { externalChains } from '../../external/blockchains';
import { fioAddPublicAddress } from '../../eos/fio';
import styles from './RegisterAddress.style';
import { KHeader, KText, KButton, RequestSendButtons } from '../../components';
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
  const [pendingFioRequests, setPendingFioRequests] = useState();
  const [pendingFioRequestsLink, setPendingFioRequestsLink] = useState('');
  const [sentFioRequests, setSentFioRequests] = useState();
  const [sentFioRequestsLink, setSentFioRequestsLink] = useState('');
  const [actor, setActor] = useState();
  const [fioFee, setFioFee] = useState(0);
  var initialConnectedAccounts = [];
  var initialFilteredAccounts = [];
  var initialExternalAccounts = [];
  const [connectedHeader, setConnectedHeader] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(initialFilteredAccounts);
  const [externalAccounts, setExternalAccounts] = useState(initialExternalAccounts);

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

  const checkRegPubkey = async account => {
    //console.log('Checking registered pubkey for ' + account.chainName + ": " + account.accountName);
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


  const updateAccountLists = (account, accountPubkeyEntry) => {
    var [actor, regPubkey] = accountPubkeyEntry.split(',');
    const accPubkey = ecc.privateToPublic(account.privateKey);
    //console.log(accPubkey + " == " + regPubkey);
    if (accPubkey == regPubkey) {
      account.title = 'Connected '  + account.chainName + ': ' + account.accountName;
      if (connectedHeader == '') {
        setConnectedHeader('Connected accounts to this address:');
      }
      var newConnectedAccounts = [...initialConnectedAccounts , account ];
      initialConnectedAccounts.push(account);
      setConnectedAccounts(newConnectedAccounts);
    } else {
      account.title = 'Connect '  + account.chainName + ': ' + account.accountName;
      var newFilteredAccounts = [...initialFilteredAccounts , account ];
      initialFilteredAccounts.push(account);
      setFilteredAccounts(newFilteredAccounts);
    }
  }

  const _handleConnectAccountToAddress = async account => {
    try {
      const res = await fioAddPublicAddress(fioAccount, account, fioFee);
      if (res) {
        Alert.alert("Successfully added!");
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const checkRegistration = pubkey => {
    if (executionCount > 0) {
      return;
    }
    //console.log('Check registration for ' + pubkey);
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

  const getPendingFioRequests = async pubkey => {
    fetch('https://fio.eostribe.io/v1/chain/get_pending_fio_requests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_public_key: pubkey,
        limit: 100,
        offset: 0
      }),
    })
      .then(response => response.json())
      .then(json => updatePendingFioRequests(json.requests))
      .catch(error => console.error(error));
  };

  const getSentFioRequests = async pubkey => {
    fetch('https://fio.eostribe.io/v1/chain/get_sent_fio_requests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_public_key: pubkey,
        limit: 100,
        offset: 0
      }),
    })
      .then(response => response.json())
      .then(json => updateSentFioRequests(json.requests))
      .catch(error => console.error(error));
  };

  const getFioBalance = async pubkey => {
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
      .then(json => setFioFee(json.fee))
      .catch(error => console.error(error));
  };

  const updateActor = actor => {
    if (!fioAccount.accountName) {
      fioAccount.accountName = actor;
    }
    setActor(actor);
  };

  const updatePendingFioRequests = requests => {
    if (requests) {
      setPendingFioRequests(requests);
      setPendingFioRequestsLink('View ' + requests.length + ' pending FIO requests');
    }
  };

  const updateSentFioRequests = requests => {
    if (requests) {
      setSentFioRequests(requests);
      setSentFioRequestsLink('View ' + requests.length + ' sent FIO requests');
    }
  };

  const updateExternalAccounts = (chain, pubkey) => {
    if (pubkey) {
      var record = { chain_code: chain, public_key: pubkey};
      var newExternalAccounts = [...initialExternalAccounts , record ];
      initialExternalAccounts.push(record);
      setExternalAccounts(newExternalAccounts);
      if (connectedHeader == '') {
        setConnectedHeader('Connected accounts to this address:');
      }
    }
  };

  const loadExternalAccounts = () => {
    externalChains.map((value, index, array) => {
      fetch('http://fio.eostribe.io/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "fio_address": fioAccount.address,
          "chain_code": value.chain_code,
          "token_code": value.token_code
        }),
      })
      .then(response => response.json())
      .then(json => updateExternalAccounts(value.chain_code, json.public_address))
      .catch(error => console.log(error));
    });
  };

  const loadActor = async pubkey => {
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
      .then(json => updateActor(json.actor))
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
      getPendingFioRequests(fioKey);
      getSentFioRequests(fioKey);
      loadActor(fioKey);
      loadExternalAccounts();
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

  const _handleBackupKey = () => {
    const account = fioAccount
    console.log(account);
    navigate('PrivateKeyBackup', { account });
  };

  const _handleFIORequest = () => {
    navigate('FIORequest');
  };

  const _handleFIOSend = () => {
    navigate('FIOSend');
  };

  const _handleShowPendingRequests = () => {
    if (pendingFioRequests.length > 1) {
      const fioRequests = pendingFioRequests;
      const title = 'Pending FIO requests';
      navigate('ListFIORequests', { fioAccount, fioRequests, title });
    } else {
      const fioRequest = pendingFioRequests[0];
      const title = 'Pending FIO request';
      navigate('ViewFIORequest', { fioAccount, fioRequest, title });
    }
  };

  const _handleShowSentRequests = () => {
    if (sentFioRequests.length > 1) {
      const fioRequests = sentFioRequests;
      const title = 'Sent FIO requests';
      navigate('ListFIORequests', { fioAccount, fioRequests, title });
    } else {
      const fioRequest = sentFioRequests[0];
      const title = 'Sent FIO request';
      navigate('ViewFIORequest', { fioAccount, fioRequest, title });
    }
  };

  const _handleConnectExternalAccount = () => {
    navigate('FIORegisterExternal');
  }

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
        <KText>Actor: {actor}</KText>
        <KText>Balance: {fioBalance} FIO</KText>
        <KText>Connect fee: {fioFee} FIO</KText>
        <KText>{fioRegistrationContent}</KText>
        <Text style={styles.link} onPress={_handleShowPendingRequests}>{pendingFioRequestsLink}</Text>
        <Text style={styles.link} onPress={_handleShowSentRequests}>{sentFioRequestsLink}</Text>
        <View style={styles.spacer} />
        <KText>{connectedHeader}</KText>
        <FlatList
          data={connectedAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <Text style={styles.link} onPress={() => _handlePressAccount(index)}>{item.chainName}: {item.accountName}</Text>
          )}
        />
        <FlatList
          data={externalAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <Text>{item.chain_code}: {item.public_key}</Text>
          )}
        />
        <KText>Connect accounts to this address:</KText>
        <KButton
            title={'Register external account'}
            theme={'brown'}
            style={styles.button}
            onPress={_handleConnectExternalAccount}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
            )}
          />
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

        <RequestSendButtons
            style={styles.button}
            onRequestPress={_handleFIORequest}
            onSendPress={_handleFIOSend}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/transfer.png')}
              style={styles.buttonIcon}
            />
            )}
        />
        <KButton
            title={'Backup private key'}
            theme={'primary'}
            style={styles.button}
            onPress={_handleBackupKey}
            renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
            )}
          />
      </View>
    </SafeAreaView>
  );
};


/*
        Disabled:
        <KButton
          title={'Remove this FIO address'}
          theme={'brown'}
          style={styles.button}
          icon={'remove'}
          onPress={_handleRemoveAccount}
        />
*/

export default connectAccounts()(FIOAddressActionsScreen);
