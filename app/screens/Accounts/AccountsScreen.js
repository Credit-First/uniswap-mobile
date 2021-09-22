import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  Image,
  View,
  FlatList,
  SafeAreaView,
  Linking,
  Text,
  Alert,
} from 'react-native';
import { KButton, KText } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { getFioChatEndpoint, fioAddPublicAddress } from '../../eos/fio';
import AccountListItem from './components/AccountListItem';
import { getAccount } from '../../eos/eos';
import { getChain, getEndpoint } from '../../eos/chains';
import { getBalance } from '../../eos/tokens';
import { findIndex } from 'lodash';
import { getLatestPrices } from '../../pricing/coinmarketcap';
import { log } from '../../logger/logger';


const AccountsScreen = props => {
  const {
    connectAccount,
    deleteAccount,
    addAddress,
    addKey,
    setTotal,
    navigation: { navigate },
    accountsState: { accounts, addresses, keys, totals, config },
    chooseActiveAccount,
  } = props;

  const fioEndpoint = getEndpoint('FIO');
  const chatEndpoint = getFioChatEndpoint();

  var initialConnectedAccounts = accounts;
  const [connectedAccounts, setConnectedAccounts] = useState(
    initialConnectedAccounts,
  );
  const [runCount, setRunCount] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [usdTotal, setUsdTotal] = useState(0.0);

  //console.log(totals);
  // Make sure empty account records removed:
  accounts.map((value, index, array) => {
    if(!value) {
      console.log("Delete account #"+index);
      deleteAccount(index);
    }
  });

  const validAccounts = accounts.filter((value, index, array) => {
    return (value != null);
  });

  const addAddressesToAddressbook = (json, actor, publicKey) => {
    try {
      for (var i in json.fio_addresses) {
        let address = json.fio_addresses[i].fio_address;
        if (address && publicKey) {
          let nameDomainArr = address.split('@');
          let name = nameDomainArr[0];
          let addressJson = {
            name: name,
            address: address,
            actor: actor,
            publicKey: publicKey,
          };
          let matchingAddresses = addresses.filter(
            (item, index) => item.address === address,
          );
          if (matchingAddresses.length == 0) {
            addAddress(addressJson);
            setNewMessageCount(newMessageCount + 1);
          }
        } else {
          log({
            description:
              'addAddressesToAddressbook - failed to parse address|publicKey for actor: ' +
              actor,
            cause: json,
            location: 'AccountsScreen',
          });
        }
      }
    } catch (err) {
      log({
        description:
          'addAddressesToAddressbook - error parsing address|publicKey for actor: ' +
          actor,
        cause: err,
        location: 'AccountsScreen',
      });
    }
  };

  const loadAddressByAccount = (account, actor) => {
    try {
      let publicKey = account.permissions[0].required_auth.keys[0].key;
      if (publicKey) {
        const endpoint = fioEndpoint + '/v1/chain/get_fio_names';
        fetch(endpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fio_public_key: publicKey,
          }),
        })
          .then(response => response.json())
          .then(json => addAddressesToAddressbook(json, actor, publicKey))
          .catch(error =>
            log({
              description: 'loadAddressByAccount - fetch ' + endpoint,
              cause: error,
              location: 'AccountsScreen',
            }),
          );
      } else {
        log({
          description:
            'loadAddressByAccount - failed to load publicKey from account',
          cause: account,
          location: 'AccountsScreen',
        });
      }
    } catch (err) {
      log({
        description:
          'loadAddressByAccount - failed to load account permissions',
        cause: err,
        location: 'AccountsScreen',
      });
    }
  };

  const loadAccountByActorName = actor => {
    const endpoint = fioEndpoint + '/v1/chain/get_account';
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_name: actor,
        }),
      })
        .then(response => response.json())
        .then(json => loadAddressByAccount(json, actor))
        .catch(error =>
          log({
            description: 'loadAccountByActorName - fetch ' + endpoint,
            cause: error,
            location: 'AccountsScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'loadAccountByActorName',
        cause: err,
        location: 'AccountsScreen',
      });
      return;
    }
  };

  const processIncomingAccount = recArr => {
    for (var i in recArr) {
      let newActor = recArr[i].from;
      let found = false;
      addresses.map((value, index, array) => {
        if (value.actor == newActor) {
          found = true;
        }
      });
      if (!found) {
        loadAccountByActorName(newActor);
      }
    }
  };

  const loadIncomingMessages = fioAccount => {
    const publicKey = Ecc.privateToPublic(fioAccount.privateKey);
    const actor = Fio.accountHash(publicKey);
    let baseUrl = chatEndpoint.replace('messages', 'incoming_messages');
    let endpoint = baseUrl + '/' + actor + '/counts';
    try {
      fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => processIncomingAccount(json))
        .catch(error =>
          log({
            description: 'loadIncomingMessages - fetch ' + endpoint,
            cause: error,
            location: 'AccountsScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'loadIncomingMessages',
        cause: err,
        location: 'AccountsScreen',
      });
      return;
    }
  };

  const telosAccounts = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'Telos');
  });

  const fioAccounts = accounts.filter((value, index, array) => {
    if (value != null && value.chainName === 'FIO') {
      loadIncomingMessages(value);
    }
    return (value != null && value.chainName === 'FIO');
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return (value != null && value.chainName === 'ALGO');
  });

  const updateAccountLists = account => {
    var newConnectedAccounts = [...initialConnectedAccounts, account];
    initialConnectedAccounts.push(account);
    setConnectedAccounts(newConnectedAccounts);
  };

  const _handlePressAccount = index => {
    const account = validAccounts[index];
    if (account == null) return;
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else if (account.chainName === 'ALGO') {
      navigate('AlgoAccount', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

  const _handlePressTokenList = index => {
    const account = validAccounts[index];
    navigate('Tokens', { account });
  };

  const updateTotal = () => {
    var newTotal = 0;
    for (const elem of totals) {
      try {
        newTotal += parseFloat(elem.total)
      } catch(err) {
        console.log(err);
      }
    }
    setUsdTotal(newTotal.toFixed(2));
  };

  const _handleBalanceUpdate = async (account, balance) => {
    var prices = await getLatestPrices();
    let chain = (account.chainName==="Telos") ? "TLOS" : account.chainName;
    let price = prices[chain];
    let usdval = (price!==null) ? (price * balance).toFixed(2) : 0.0;
    let name = (chain==='FIO') ? account.address : account.accountName;
    let record = {
      "account": chain + ":" + name,
      "total": usdval
    };
    setTotal(record);
    updateTotal();
  };

  const getAppVersion = () => {
    return (
      'Version ' +
      DeviceInfo.getVersion() +
      ', Build ' +
      DeviceInfo.getBuildNumber()
    );
  };

  const goToAppStore = () => {
    Linking.openURL('https://apps.apple.com/us/app/id1521532252');
  };

  const goToPlayStore = () => {
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.kryptowallet',
    );
  };

  const parseIOSVersion = html => {
    let pattern = 'data-test-version-number>Version ';
    let index = html.indexOf(pattern);
    if (index > 0) {
      let startPos = index + pattern.length;
      let endPos = startPos + 3;
      var version = html.substring(startPos, endPos);
      let appVersion = DeviceInfo.getVersion();
      //console.log('App Store Version '+version+' vs. App Version '+appVersion);
      if (appVersion !== version) {
        Alert.alert(
          'New version available!',
          'Download latest version ' +
            version +
            ' of TRIBE Wallet from App Store.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Update wallet cancelled'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => goToAppStore() },
          ],
          { cancelable: true },
        );
      }
    }
  };

  const checkLatestIOSVersion = () => {
    let storeUrl = 'https://apps.apple.com/us/app/id1521532252';
    try {
      fetch(storeUrl, { method: 'GET' })
        .then(response => response.text())
        .then(text => parseIOSVersion(text))
        .catch(error =>
          log({
            description: 'checkLatestIOSVersion - fetch ' + storeUrl,
            cause: error,
            location: 'AccountsScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'checkLatestIOSVersion',
        cause: err,
        location: 'AccountsScreen',
      });
    }
  };

  const parseAndroidVersion = html => {
    let pattern = 'Current Version</div>';
    let index = html.indexOf(pattern);
    if (index > 0) {
      let startPos = index + pattern.length;
      var secondHalf = html.substring(startPos);
      let endPos = secondHalf.indexOf('</span>');
      startPos = endPos - 4;
      let version = secondHalf.substring(startPos, endPos);
      let appVersion = DeviceInfo.getVersion();
      let versionFloat = 0.0;
      let appVersionFloat = 0.0;
      console.log(
        'Play Store Version ' + version + ' vs. App Version ' + appVersion,
      );
      try {
        versionFloat = parseFloat(version);
        appVersionFloat = parseFloat(appVersion);
      } catch (err) {
        console.log('Failed to parse float versions', err);
      }
      if (versionFloat > appVersionFloat) {
        Alert.alert(
          'New version available!',
          'Download latest version ' +
            version +
            ' of TRIBE Wallet from Play Store.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Update wallet cancelled'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => goToPlayStore() },
          ],
          { cancelable: true },
        );
      }
    }
  };

  const checkLatestAndroidVersion = () => {
    let storeUrl =
      'https://play.google.com/store/apps/details?id=com.kryptowallet';
    try {
      fetch(storeUrl, { method: 'GET' })
        .then(response => response.text())
        .then(text => parseAndroidVersion(text))
        .catch(error =>
          log({
            description: 'checkLatestAndroidVersion - fetch ' + storeUrl,
            cause: error,
            location: 'AccountsScreen',
          }),
        );
    } catch (err) {
      log({
        description: 'checkLatestAndroidVersion',
        cause: err,
        location: 'AccountsScreen',
      });
    }
  };

  const checkOnLatestVersion = () => {
    let brand = DeviceInfo.getBrand();
    //console.log("Device brand: "+brand);
    if (brand == 'Apple') {
      // Either iPhone device
      checkLatestIOSVersion();
    } else {
      // otherwise - Android
      checkLatestAndroidVersion();
    }
  };

  const addKeysIfMissing = () => {
    validAccounts.map(function(account) {
      if (
        account.chainName == 'EOS' ||
        account.chainName == 'Telos' ||
        account.chainName == 'WAX'
      ) {
        const privateKey = account.privateKey;
        const publicKey = ecc.privateToPublic(account.privateKey);
        const foundKeys = keys.filter((value, index, array) => {
          return value.public === publicKey;
        });
        if (foundKeys.length == 0) {
          addKey({ private: privateKey, public: publicKey });
        }
      } else if (account.chainName == 'FIO') {
        const privateKey = account.privateKey;
        const publicKey = Ecc.privateToPublic(account.privateKey);
        const foundKeys = keys.filter((value, index, array) => {
          return value.public === publicKey;
        });
        if (foundKeys.length == 0) {
          addKey({ private: privateKey, public: publicKey });
        }
      } else if (account.chainName == 'ALGO') {
        const publicKey = account.account.addr;
        const privateKey = account.mnemonic;
        const foundKeys = keys.filter((value, index, array) => {
          return value.public === publicKey;
        });
        if (foundKeys.length == 0) {
          addKey({ private: privateKey, public: publicKey });
        }
      }
    });
  };

  if (runCount == 0) {
    setRunCount(1);
    checkOnLatestVersion();
    addKeysIfMissing();
  }

  var optionalButtons = <View style={styles.spacer} />;
  if (fioAccounts.length == 0) {
    optionalButtons = (
      <View>
        <KButton
          title={'Register [address]@tribe'}
          theme={'brown'}
          style={styles.button}
          icon={'add'}
          onPress={() => navigate('RegisterFIOAddress')}
        />
      </View>
    );
  }

  if (validAccounts.length == 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/logo/tribe-logo.png')}
          resizeMode="contain"
        />
        {optionalButtons}
        <KButton
          title={'Import accounts'}
          theme={'blue'}
          style={styles.button}
          onPress={() => navigate('ConnectAccount')}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
          )}
        />
        <Text style={styles.version}>{getAppVersion()}</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/logo/tribe-logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.total}>${usdTotal}</Text>
        <FlatList
          data={validAccounts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <AccountListItem
              account={item}
              style={styles.listItem}
              onPress={() => _handlePressAccount(index)}
              onTokenPress={() => _handlePressTokenList(index)}
              onBalanceUpdate={_handleBalanceUpdate}
            />
          )}
        />
        {optionalButtons}
        <KButton
          title={'Import accounts'}
          theme={'blue'}
          style={styles.button}
          onPress={() => navigate('ConnectAccount')}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
          )}
        />
        <KButton
          title={'Backup All Keys!'}
          theme={'brown'}
          style={styles.button}
          onPress={() => navigate('BackupAllKeys')}
          renderIcon={() => (
            <Image
              source={require('../../../assets/icons/accounts.png')}
              style={styles.buttonIcon}
            />
          )}
        />
        <Text style={styles.version}>
          New messages: {newMessageCount}, {getAppVersion()}
        </Text>
      </SafeAreaView>
    );
  }
};

export default connectAccounts()(AccountsScreen);
