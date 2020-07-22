import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { externalChains } from '../../external/blockchains';
import { fioAddPublicAddress, fioAddExternalAddress } from '../../eos/fio';
import { log } from '../../logger/logger'
import styles from './RegisterAddress.style';
import { KHeader, KText, KButton, RequestSendButtons } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import AccountListItem from '../Accounts/components/AccountListItem';


const FIOAddressActionsScreen = props => {
  const [fioRegistrationContent, setFioRegistrationContent] = useState();
  const [registrationLink, setRegistrationLink] = useState();
  const [executionCount, setExecutionCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
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
    connectAccount,
    deleteAccount,
    navigation: { navigate, goBack },
    route: {
      params: { account: fioAccount },
    },
    accountsState: { accounts },
  } = props;

  const fioDivider = 1000000000;
  const privateKey = fioAccount.privateKey;
  const fioKey = Ecc.privateToPublic(privateKey);

  const checkRegPubkey = async account => {
    var chainName = account.chainName;
    if(chainName == "Telos") {
      chainName = "TLOS";
    }
    fetch('http://fio.greymass.com/v1/chain/get_pub_address', {
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
      .then(json => updateAccountLists(account, json))
      .catch(error => log({
        description: 'checkRegPubkey - fetch http://fio.greymass.com/v1/chain/get_pub_address',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
  };

  const addAccountToConnectedList = (account) => {
    if (connectedHeader == '') {
      setConnectedHeader('Connected accounts to this address:');
    }
    var newConnectedAccounts = [...initialConnectedAccounts , account ];
    initialConnectedAccounts.push(account);
    setConnectedAccounts(newConnectedAccounts);
  };

  const addAccountToFilteredList = (account) => {
    var newFilteredAccounts = [...initialFilteredAccounts , account ];
    initialFilteredAccounts.push(account);
    setFilteredAccounts(newFilteredAccounts);
  };

  const updateAccountLists = (account, json) => {
    log(json);
    let accountPubkeyEntry = json.public_address;
    var accPubkey = '';
    if (account.chainName==='ALGO') {
      accPubkey = account.account.addr;
    } else if(account.privateKey) {
      accPubkey = ecc.privateToPublic(account.privateKey);
    }
    if (accountPubkeyEntry && accountPubkeyEntry.indexOf(',') > 0) {
      var [actor, regPubkey] =  accountPubkeyEntry.split(',');
      if (accPubkey == regPubkey) {
        addAccountToConnectedList(account);
      } else {
        addAccountToFilteredList(account);
      }
    } else if(accountPubkeyEntry) {
      if (accPubkey == accountPubkeyEntry) {
        addAccountToConnectedList(account);
      } else {
        addAccountToFilteredList(account);
      }
    } else {
      addAccountToFilteredList(account);
    }
  };


  const _handleConnectAccountToAddress = async account => {
    try {
      setLoading(true);
      setFilteredAccounts(filteredAccounts.filter(function(item) { return item != account; }));
      if (account.chainName==='ALGO') {
        const res = await fioAddExternalAddress(fioAccount, 'ALGO', account.account.addr, fioFee);
        if (res && res.transaction_id) {
          Alert.alert("Successfully added in tx "+res.transaction_id);
        } else {
    			Alert.alert("Something went wrong: "+res.message);
    		}
      } else {
        const res = await fioAddPublicAddress(fioAccount, account, fioFee);
        if (res && res.transaction_id) {
          Alert.alert("Successfully added in tx "+res.transaction_id);
        } else {
    			Alert.alert("Something went wrong: "+res.message);
    		}
      }
      setLoading(false);
    } catch (e) {
      Alert.alert(e.message);
      setLoading(false);
    }
  };

  const checkRegistration = pubkey => {
    if (executionCount > 0) {
      return;
    }
    setExecutionCount(1);
    fetch('http://fio.greymass.com/v1/chain/get_fio_names', {
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
      .then(json => updateFioRegistration(json))
      .catch(error => log({
        description: 'checkRegistration - fetch http://fio.greymass.com/v1/chain/get_fio_names',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
  };

  const getPendingFioRequests = async pubkey => {
    fetch('http://fio.greymass.com/v1/chain/get_pending_fio_requests', {
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
      .catch(error => log({
        description: 'getPendingFioRequests - fetch https://fio.greymass.com/v1/chain/get_pending_fio_requests',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
  };

  const getSentFioRequests = async pubkey => {
    fetch('http://fio.greymass.com/v1/chain/get_sent_fio_requests', {
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
      .catch(error => log({
        description: 'getSentFioRequests - fetch https://fio.greymass.com/v1/chain/get_sent_fio_requests',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
  };

  const getFioBalance = async pubkey => {
    fetch('http://fio.greymass.com/v1/chain/get_fio_balance', {
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
      .then(json => setFioBalance(((json.balance!==undefined) ? (parseFloat(json.balance)/fioDivider).toFixed(4) : 0)))
      .catch(error => log({
        description: 'getFioBalance - fetch http://fio.greymass.com/v1/chain/get_fio_balance',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
  };

  const getFee = async address => {
    fetch('http://fio.greymass.com/v1/chain/get_fee', {
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
      .catch(error => log({
        description: 'getFee - fetch http://fio.greymass.com/v1/chain/get_fee',
        cause: error,
        location: 'FIOAddressActionsScreen'
      })
    );
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
      fetch('http://fio.greymass.com/v1/chain/get_pub_address', {
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
      .catch(error => log({
          description: 'loadExternalAccounts - fetch http://fio.greymass.com/v1/chain/get_pub_address',
          cause: error,
          location: 'FIOAddressActionsScreen'
        })
      );
    });
  };

  const loadActor = async pubkey => {
    fetch('http://fio.greymass.com/v1/chain/get_actor', {
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
      .catch(error => log({
          description: 'loadActor - fetch http://fio.greymass.com/v1/chain/get_actor',
          cause: error,
          location: 'FIOAddressActionsScreen'
        })
      );
  };

  const registerFioAddress = () => {
    Linking.openURL('https://reg.fioprotocol.io/ref/tribe?publicKey=' + fioKey);
  };

  const replacePendingFioAddress = (fioAddress) => {
    // Delete old pending FIO account:
    const index = findIndex(
      accounts,
      el =>
        el.address === fioAccount.address &&
        el.chainName === fioAccount.chainName,
    );
    deleteAccount(index);
    // Connect new FIO account:
    let account = { address: fioAddress, privateKey: privateKey, chainName: 'FIO' };
    connectAccount(account);
    fioAccount.address = fioAddress;
  };

  const updateFioRegistration = json => {
    let fioAddresses = json.fio_addresses;
    if (fioAddresses) {
      var content = fioAddresses.map(function(item) {
        if (fioAccount.address !== item.fio_address) {
          if(fioAccount.address === 'pending@tribe') {
            replacePendingFioAddress(item.fio_address);
          } else {
            fioAccount.address = item.fio_address;
          }
        }
        return item.fio_address + ' expires ' + item.expiration + ', ';
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
      Alert.alert(json.message);
      setRegistered(false);
      setButtonColor('gray');
      setFioRegistrationContent('Unregistered address');
      setRegistrationLink(
        <KButton
          title={'Register this address'}
          theme={'brown'}
          style={styles.button}
          icon={'add'}
          onPress={registerFioAddress}
        />
      );
    }
  };

  const _handleRemoveAccount = () => {
    const index = findIndex(
      accounts,
      el =>
        el.address === fioAccount.address &&
        el.chainName === fioAccount.chainName,
    );
    Alert.alert(
      'Delete FIO Account',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete account cancelled'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => deleteAccount(index) }
      ],
      { cancelable: false }
    );
    goBack();
  };

  const _handlePressAccount = index => {
    const account = connectedAccounts[index];
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else if (account.chainName === 'ALGO') {
      navigate('AlgoAccount', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

  const _handleBackupKey = () => {
    const account = fioAccount
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

  if (executionCount === 0) {
    checkRegistration(fioKey);
  }

  const getConnectAccountText = (account) => {
    return 'Connect '  + account.chainName + ': ' + account.accountName;
  }

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
        <FlatList
          data={filteredAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <Text style={styles.link} onPress={() => _handleConnectAccountToAddress(item)}>{getConnectAccountText(item)}</Text>
          )}
        />
        <RequestSendButtons
            style={styles.button}
            onRequestPress={_handleFIORequest}
            onSendPress={_handleFIOSend}
            visible={registered}
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
          <Text style={styles.link} onPress={_handleRemoveAccount}>{'Remove this FIO address'}</Text>
          {registrationLink}
      </View>
    </SafeAreaView>
  );
};


export default connectAccounts()(FIOAddressActionsScreen);
