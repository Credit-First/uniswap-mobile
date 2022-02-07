import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Linking,
  Alert,
} from 'react-native';
import ChainAddressItem from './components/ChainAddressItem';
import ConnectAddressItem from './components/ConnectAddressItem';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { fioAddPublicAddress, fioAddExternalAddress } from '../../eos/fio';
import { log } from '../../logger/logger';
import styles from './RegisterAddress.style';
import { KHeader, KText, KButton, FiveIconsButtons } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { findIndex } from 'lodash';
import { getEndpoint } from '../../eos/chains';
import { getKeyPair } from '../../stellar/stellar';


const FIOAddressRegistryScreen = props => {
  const [fioExpirationDate, setFioExpirationDate] = useState();
  const [fioRegistrationContent, setFioRegistrationContent] = useState();
  const [registrationLink, setRegistrationLink] = useState();
  const [executionCount, setExecutionCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonColor, setButtonColor] = useState('grey');
  const [totalBalance, setTotalBalance] = useState(0.0);
  const [availableBalance, setAvailableBalance] = useState(0.0);
  const [stakedBalance, setStakedBalance] = useState(0.0);
  const [lockedBalance, setLockedBalance] = useState(0.0);
  const [rewardsBalance, setRewardsBalance] = useState(0.0);
  const [roe, setRoe] = useState(0.5);
  const [srps, setSrps] = useState(0);
  const [pendingFioRequests, setPendingFioRequests] = useState();
  const [pendingFioRequestsLink, setPendingFioRequestsLink] = useState('');
  const [sentFioRequests, setSentFioRequests] = useState();
  const [sentFioRequestsLink, setSentFioRequestsLink] = useState('');
  const [actor, setActor] = useState();
  const [fioFee, setFioFee] = useState(0);
  var initialConnectedAccounts = [];
  var initialFilteredAccounts = [];
  const [connectedHeader, setConnectedHeader] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState(
    initialConnectedAccounts,
  );
  const [disconnectedHeader, setDisconnectedHeader] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(
    initialFilteredAccounts,
  );


  const {
    connectAccount,
    deleteAccount,
    navigation: { navigate, goBack },
    route: {
      params: { account: fioAccount },
    },
    accountsState: { accounts, addresses, keys, totals, history, config },
  } = props;

  const blockchains = ['EOS','TLOS','FIO','XLM','ALGO','ETH'];

  const fioDivider = 1000000000;
  const privateKey = fioAccount.privateKey;
  const fioKey = Ecc.privateToPublic(privateKey);
  const fioEndpoint = getEndpoint('FIO');

  const name = "FIO:" + fioAccount.address;
  var usdValue = 0;
  for (const elem of totals) {
    if(elem.account===name) {
      usdValue = elem.total;
      break;
    }
  }

  const checkRegPubkey = async account => {
    var chainName = account.chainName;
    if (chainName === 'Telos') {
      chainName = 'TLOS';
    }
    fetch(fioEndpoint + '/v1/chain/get_pub_address', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_address: fioAccount.address,
        chain_code: chainName,
        token_code: chainName,
      }),
    })
      .then(response => response.json())
      .then(json => updateAccountLists(account, json))
      .catch(error =>
        log({
          description:
            'checkRegPubkey - fetch ' +
            fioEndpoint +
            '/v1/chain/get_pub_address',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const getItemFromAccount = (account, external) => {
    const chainName = account.chainName;
    var address = account.accountName;
    if(chainName==='FIO'||chainName==='XLM'||chainName==='ETH') {
      address = account.address;
    } else if(chainName==='ALGO' && account.account !== undefined && account.account.addr !== undefined) {
      address = account.account.addr;
    }
    return {chainName: chainName, address: address, external: external};
  }

  const addAccountToConnectedList = (account, external) => {
    if (connectedHeader === '') {
      setConnectedHeader('Connected accounts to this address:');
    }
    const chainName = account.chainName;
    var address = account.accountName;
    if(chainName==='FIO'||chainName==='XLM'||chainName==='ETH') {
      address = account.address;
    } else if(chainName==='ALGO') {
      if(account.account !== undefined && account.account.addr !== undefined) {
        address = account.account.addr;
      } else {
        address = account.address;
      }
    }
    const item = getItemFromAccount(account, external);
    var newConnectedAccounts = [...initialConnectedAccounts, item];
    initialConnectedAccounts.push(item);
    setConnectedAccounts(newConnectedAccounts);
  };

  const appendAccountToConnectedList = (account, external) => {
    if (connectedHeader === '') {
      setConnectedHeader('Connected accounts to this address:');
    }
    const item = getItemFromAccount(account, external);
    var newConnectedAccounts = [...connectedAccounts, item];
    setConnectedAccounts(newConnectedAccounts);
  };

  const addAccountToFilteredList = account => {
    if (disconnectedHeader === '') {
      setDisconnectedHeader('Connect accounts to this address:');
    }
    var newFilteredAccounts = [...initialFilteredAccounts, account];
    initialFilteredAccounts.push(account);
    setFilteredAccounts(newFilteredAccounts);
  };

  const updateAccountLists = (account, json) => {
    let accountPubkeyEntry = json.public_address;
    var accPubkey = '';
    if (account.chainName === 'ALGO') {
      accPubkey = account.account.addr;
    } else if(account.chainName === 'XLM' || account.chainName === 'ETH' || account.chainName === 'FIO') {
      accPubkey = account.address;
    } else if (account.privateKey) {
      accPubkey = ecc.privateToPublic(account.privateKey);
    }
    if (accountPubkeyEntry && accountPubkeyEntry.indexOf(',') > 0) {
      var [, regPubkey] = accountPubkeyEntry.split(',');
      if (accPubkey === regPubkey) {
        addAccountToConnectedList(account, false);
      } else {
        addAccountToFilteredList(account);
      }
    } else if (accountPubkeyEntry) {
      if (accPubkey === accountPubkeyEntry) {
        addAccountToConnectedList(account, false);
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
      setFilteredAccounts(
        filteredAccounts.filter(function(item) {
          return item !== account;
        }),
      );
      appendAccountToConnectedList(account);
      if (account.chainName === 'ALGO') {
        const res = await fioAddExternalAddress(
          fioAccount,
          'ALGO',
          account.account.addr,
          fioFee,
        );
        if (res && res.transaction_id) {
          Alert.alert('Successfully added in tx ' + res.transaction_id);
        } else {
          let error = {
            description: 'Failed _handleConnectAccountToAddress',
            method: 'fioAddExternalAddress',
            location: 'FIOAddressActionsScreen',
            cause: res,
            fioAccount: fioAccount.address,
            account: account.account.addr,
            fioFee: fioFee,
          };
          log(error);
          Alert.alert('Failed to link ALGO account to FIO address.');
        }
      } else if(account.chainName === 'XLM') {
        const res = await fioAddExternalAddress(
          fioAccount,
          'XLM',
          account.address,
          fioFee,
        );
        if (res && res.transaction_id) {
          Alert.alert('Successfully added in tx ' + res.transaction_id);
        } else {
          let error = {
            description: 'Failed _handleConnectAccountToAddress',
            method: 'fioAddExternalAddress',
            location: 'FIOAddressActionsScreen',
            cause: res,
            fioAccount: fioAccount.address,
            account: account.address,
            fioFee: fioFee,
          };
          log(error);
          Alert.alert('Failed to link Stellar account to FIO address.');
        }
      } else if(account.chainName === 'ETH') {
        const res = await fioAddExternalAddress(
          fioAccount,
          'ETH',
          account.address,
          fioFee,
        );
        if (res && res.transactionHash) {
          Alert.alert('Successfully added in tx ' + res.transactionHash);
        } else {
          let error = {
            description: 'Failed _handleConnectAccountToAddress',
            method: 'fioAddExternalAddress',
            location: 'FIOAddressActionsScreen',
            cause: res,
            fioAccount: fioAccount.address,
            account: account.address,
            fioFee: fioFee,
          };
          log(error);
          Alert.alert('Failed to link Ethereum account to FIO address.');
        }
      } else {
        const res = await fioAddPublicAddress(fioAccount, account, fioFee);
        if (res && res.transaction_id) {
          Alert.alert('Successfully added in tx ' + res.transaction_id);
        } else {
          let error = {
            description: 'Failed _handleConnectAccountToAddress',
            method: 'fioAddPublicAddress',
            location: 'FIOAddressActionsScreen',
            cause: res,
            fioAccount: fioAccount.address,
            account: account.accountName,
            fioFee: fioFee,
          };
          log(error);
          Alert.alert('Failed to link account to FIO address.');
        }
      }
      setLoading(false);
    } catch (e) {
      Alert.alert(e.message);
      setLoading(false);
    }
  };

  const checkRegistration = async pubkey => {
    if (executionCount > 0) {
      return;
    }
    setExecutionCount(1);

    fetch(fioEndpoint + '/v1/chain/get_fio_names', {
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
      .catch(error =>
        log({
          description:
            'checkRegistration - fetch ' +
            fioEndpoint +
            '/v1/chain/get_fio_names',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const getPendingFioRequests = async pubkey => {
    fetch(fioEndpoint + '/v1/chain/get_pending_fio_requests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_public_key: pubkey,
        limit: 1000,
        offset: 0,
      }),
    })
      .then(response => response.json())
      .then(json => updatePendingFioRequests(json.requests))
      .catch(error =>
        log({
          description:
            'getPendingFioRequests - fetch ' +
            fioEndpoint +
            '/v1/chain/get_pending_fio_requests',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const getSentFioRequests = async pubkey => {
    fetch(fioEndpoint + '/v1/chain/get_sent_fio_requests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fio_public_key: pubkey,
        limit: 1000,
        offset: 0,
      }),
    })
      .then(response => response.json())
      .then(json => updateSentFioRequests(json.requests))
      .catch(error =>
        log({
          description:
            'getSentFioRequests - fetch ' +
            fioEndpoint +
            '/v1/chain/get_sent_fio_requests',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const getFioBalance = async pubkey => {
    console.log(fioEndpoint + '/v1/chain/get_fio_balance');
    fetch(fioEndpoint + '/v1/chain/get_fio_balance', {
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
      .then(json => {
          //json: {"available": 47818352529, "balance": 47818352529, "roe": "0.500000000000000", "srps": 0, "staked": 0}
          try {
            console.log("getFioBalance", json);
            let tBalance = json.balance !== undefined ? (parseFloat(json.balance) / fioDivider).toFixed(4) : 0;
            if(tBalance > 0) setTotalBalance(tBalance);
            let aBalance = json.available !== undefined ? (parseFloat(json.available) / fioDivider).toFixed(4) : 0;
            if(aBalance > 0) setAvailableBalance(aBalance);
            let sBalance = json.staked !== undefined ? (parseFloat(json.staked) / fioDivider).toFixed(4) : 0;
            if(sBalance > 0) setStakedBalance(sBalance);
            var lBalance = parseFloat(tBalance) - parseFloat(aBalance) - parseFloat(sBalance);
            lBalance = (lBalance > 0) ? lBalance.toFixed(4) : 0;
            if(lBalance > 0) setLockedBalance(lBalance);
            let roeNum = json.roe !== undefined ? parseFloat(json.roe).toFixed(4) : 0.5;
            setRoe(roeNum);
            let srpsNum = json.srps !== undefined ? (parseFloat(json.srps) / fioDivider).toFixed(4) : 0;
            setSrps(srpsNum);
            let stakeRewards = parseFloat((roeNum*srpsNum) - sBalance).toFixed(4);
            if(stakeRewards > 0) setRewardsBalance(stakeRewards);
          } catch(err) {
            log("Failed to parse JSON balances " + json + ", Error: " + err);
          }
        }
      )
      .catch(error =>
        log({
          description:
            'getFioBalance - fetch ' +
            fioEndpoint +
            '/v1/chain/get_fio_balance',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const getFee = async address => {
    fetch(fioEndpoint + '/v1/chain/get_fee', {
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
      .catch(error =>
        log({
          description: 'getFee - fetch ' + fioEndpoint + '/v1/chain/get_fee',
          cause: error,
          location: 'FIOAddressActionsScreen',
        }),
      );
  };

  const updatePendingFioRequests = requests => {
    if (requests) {
      setPendingFioRequests(requests);
      setPendingFioRequestsLink(
        'View ' + requests.length + ' pending FIO requests',
      );
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
      var address = pubkey;
      var publicKey = pubkey;
      // For EOSIO chains: address,publicKey
      if (pubkey.indexOf(',') > 0) {
        [address, publicKey] = pubkey.split(',');
      }
      var external = true;
      var item = {chainName: chain, address: address, accountName: address};
      accounts.map((value, index, array) => {
        if (chain === value.chainName && address === value.accountName) {
          external = false;
        } else if(chain === value.chainName && address === value.address) {
          external = false;
        } else if(chain === value.chainName && value.chainName === 'ALGO' && value.account != null && address === value.account.addr) {
          external = false;
        }
      });
      if (external) {
        addAccountToConnectedList(item, external);
      }
    }
  };

  const loadExternalAccounts = async () => {
    blockchains.map((chain, index, array) => {
      fetch(fioEndpoint + '/v1/chain/get_pub_address', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fio_address: fioAccount.address,
          chain_code: chain,
          token_code: chain,
        }),
      })
        .then(response => response.json())
        .then(json =>
          updateExternalAccounts(chain, json.public_address),
        )
        .catch(error =>
          log({
            description:
              'loadExternalAccounts - fetch ' +
              fioEndpoint +
              '/v1/chain/get_pub_address',
            cause: error,
            location: 'FIOAddressActionsScreen',
          }),
        );
    });
  };

  const registerFioAddress = () => {
    Linking.openURL('https://reg.fioprotocol.io/ref/tribe?publicKey=' + fioKey);
  };

  const replacePendingFioAddress = fioAddress => {
    // Delete old pending FIO account:
    const index = findIndex(
      accounts,
      el =>
        el.address === fioAccount.address &&
        el.chainName === fioAccount.chainName,
    );
    deleteAccount(index);
    // Connect new FIO account:
    let account = {
      address: fioAddress,
      privateKey: privateKey,
      chainName: 'FIO',
    };
    connectAccount(account);
    fioAccount.address = fioAddress;
  };

  const updateFioRegistration = json => {
    let fioAddresses = json.fio_addresses;
    setLoading(true);
    if (fioAddresses) {
      fioAddresses.map(function(item) {
        if (fioAccount.address !== item.fio_address) {
          if (fioAccount.address === 'pending@tribe') {
            replacePendingFioAddress(item.fio_address);
          } else {
            fioAccount.address = item.fio_address;
          }
        }
        setFioExpirationDate(item.expiration);
        return;
      });
      setRegistered(true);
      setButtonColor('primary');
      getFioBalance(fioKey);
      getFee(fioAccount.address);
      getPendingFioRequests(fioKey);
      getSentFioRequests(fioKey);
      setActor(Fio.accountHash(fioKey));
      loadExternalAccounts();
      accounts.map((value, index, array) => {
        if (value.chainName !== 'FIO') {
          checkRegPubkey(value);
        }
      });
      setLoading(false);
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
        />,
      );
    }
    setLoading(false);
  };


  const _handlePressAccount = index => {
    const item = connectedAccounts[index];
    var account;
    accounts.map((value, index, array) => {
      if (chain === value.chainName && address === value.accountName) {
        external = false;
      } else if(chain === value.chainName && address === value.address) {
        external = false;
      } else if(chain === value.chainName && value.chainName === 'ALGO' && value.account != null && address === value.account.addr) {
        external = false;
      }
    });
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else if (account.chainName === 'ALGO') {
      navigate('AlgoAccount', { account });
    } else if (account.chainName === 'XLM') {
      navigate('StellarAccount', { account });
    } else if (account.chainName === 'ETH') {
      navigate('EthereumAccount', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

  const showLoadingIcon = () => {
    if (connectedHeader === '') {
      return (<Image style={styles.loading}
        source={require('../../../assets/icons/loading-icon.gif')}
        resizeMode="contain"
      />);
    }
    return null;
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={35}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
         <Image
          source={require('../../../assets/chains/fio.png')}
          style={styles.buttonIcon}
         />
         <KHeader title={fioAccount.address} style={styles.header} />
        </View>
        {showLoadingIcon()}
        <KText>{connectedHeader}</KText>
        <FlatList
          data={connectedAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <ChainAddressItem
              account={item}
              style={styles.listItem}
              onPress={() => _handlePressAccount(index)}
            />
          )}
        />
        <KText>{disconnectedHeader}</KText>
        <FlatList
          data={filteredAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <ConnectAddressItem
              account={item}
              style={styles.listItem}
              onPress={() => _handleConnectAccountToAddress(index)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(FIOAddressRegistryScreen);
