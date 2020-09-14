import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Image,
  View,
  FlatList,
  SafeAreaView,
  Linking,
  Text,
  Alert } from 'react-native';
import { KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import { getFioChatEndpoint } from '../../eos/fio';
import AccountListItem from './components/AccountListItem';
import algosdk from 'algosdk';
import { getEndpoint } from '../../eos/chains';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger'


const AccountsScreen = props => {
  const {
    connectAccount,
    deleteAccount,
    addAddress,
    navigation: { navigate },
    accountsState: { accounts, activeAccountIndex, addresses },
    chooseActiveAccount,
  } = props;

  const fioEndpoint = getEndpoint('FIO');
  const chatEndpoint = getFioChatEndpoint();

  var initialConnectedAccounts = accounts;
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [runCount, setRunCount] = useState(0);

  const addAddressesToAddressbook = (json, actor, publicKey) => {
    try {
      for (var i in json.fio_addresses) {
        let address = json.fio_addresses[i].fio_address;
        if(address && publicKey) {
          let nameDomainArr = address.split('@');
          let name = nameDomainArr[0];
          let addressJson = { name: name, address: address, actor: actor, publicKey: publicKey };
          let matchingAddresses = addresses.filter((item, index) => item.address === address);
          if(matchingAddresses.length == 0) {
            addAddress(addressJson);
            Alert.alert('Incoming messages from new address '+address);
          }
        } else {
          log({ description: 'addAddressesToAddressbook - failed to parse address|publicKey for actor: '+actor, cause: json, location: 'AccountsScreen'});
        }
      }
    } catch(err) {
      log({ description: 'addAddressesToAddressbook - error parsing address|publicKey for actor: '+actor, cause: err, location: 'AccountsScreen'});
    }
  };

  const loadAddressByAccount = (account, actor) => {
    try {
      let publicKey = account.permissions[0].required_auth.keys[0].key;
      if ( publicKey ) {
        const endpoint = fioEndpoint + '/v1/chain/get_fio_names';
        fetch(endpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fio_public_key: publicKey
          }),
        })
          .then(response => response.json())
          .then(json => addAddressesToAddressbook(json, actor, publicKey))
          .catch(error => log({
            description: 'loadAddressByAccount - fetch ' + endpoint,
            cause: error,
            location: 'AccountsScreen'
          })
        );
      } else {
        log({ description: 'loadAddressByAccount - failed to load publicKey from account', cause: account, location: 'AccountsScreen'});
      }
    } catch(err) {
      log({ description: 'loadAddressByAccount - failed to load account permissions', cause: err, location: 'AccountsScreen'});
    }
  };

  const loadAccountByActorName = (actor) => {
    const endpoint = fioEndpoint + '/v1/chain/get_account';
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_name: actor
        }),
      })
        .then(response => response.json())
        .then(json => loadAddressByAccount(json, actor))
        .catch(error => log({
          description: 'loadAccountByActorName - fetch ' + endpoint,
          cause: error,
          location: 'AccountsScreen'
        })
      );
    } catch (err) {
      log({ description: 'loadAccountByActorName', cause: err, location: 'AccountsScreen'});
      return;
    }
  };

  const processIncomingAccount = (recArr) => {
    for(var i in recArr) {
      let newActor = recArr[i].from;
      let found = false;
      addresses.map((value, index, array) => {
        if(value.actor == newActor) {
          found = true;
        }
      });
      if(!found) {
        loadAccountByActorName(newActor);
      }
    }
  };

  const loadIncomingMessages = (fioaccount) => {
    const publicKey = Ecc.privateToPublic(fioaccount.privateKey);
    const actor = Fio.accountHash(publicKey);
    let baseUrl = chatEndpoint.replace('messages','incoming_messages');
    let endpoint = baseUrl+'/'+actor+'/counts';
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
        .catch(error => log({
          description: 'loadIncomingMessages - fetch '+endpoint,
          cause: error,
          location: 'AccountsScreen'
        })
      );
    } catch (err) {
      log({ description: 'loadIncomingMessages', cause: err, location: 'AccountsScreen'});
      return;
    }
  };

  const fioAccounts = accounts.filter((value, index, array) => {
    if (value.chainName === 'FIO') {
      loadIncomingMessages(value);
    }
    return value.chainName === 'FIO';
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'ALGO';
  });

  const telosAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'Telos';
  });

  const updateAccountLists = (account) => {
      var newConnectedAccounts = [...initialConnectedAccounts , account ];
      initialConnectedAccounts.push(account);
      setConnectedAccounts(newConnectedAccounts);
  };

  const _handleCreateAlgorandAccount = () => {
    var account = algosdk.generateAccount();
    var address = account.addr;
    var accountName = address.substring(0, 4) + ".." + address.substring(address.length - 4, address.length);
    var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    var algoAccount = { accountName, mnemonic, chainName: "ALGO", account: account };
    connectAccount(algoAccount);
    updateAccountLists(algoAccount);
  };

  const _handleRegisterAddress = () => {
    navigate('RegisterAddress');
  };

  const _handleCreateTelosAccount = () => {
    navigate('CreateTelosAccount');
  };

  const _handleCheckAccount = index => {
    chooseActiveAccount(index);
  };

  const _handlePressAccount = index => {
    const account = accounts[index];
    if (account.chainName === 'FIO') {
      navigate('FIOAddressActions', { account });
    } else if (account.chainName === 'ALGO') {
      navigate('AlgoAccount', { account });
    } else {
      navigate('AccountDetails', { account });
    }
  };

const getAppVersion = () => {
  return "Version " + DeviceInfo.getVersion() + ", Build " + DeviceInfo.getBuildNumber();
}

const goToAppStore = () => {
  Linking.openURL('https://apps.apple.com/us/app/id1521532252');
};

const parseIOSVersion = (html) => {
  let pattern = 'data-test-version-number>Version ';
    let index = html.indexOf(pattern);
    if(index > 0) {
      let startPos = index + pattern.length;
      let endPos = startPos + 3;
      var version = html.substring(startPos, endPos);
      let appVersion = DeviceInfo.getVersion();
      console.log('App Store Version '+version+' vs. App Version '+appVersion);
      if(appVersion !== version) {
        Alert.alert(
          'New version available!',
          'Download latest version '+version+' of TRIBE Wallet from App Store.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Update wallet cancelled'),
              style: 'cancel'
            },
            { text: 'OK', onPress: () => goToAppStore() }
          ],
          { cancelable: true }
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
      .catch(error => log({
        description: 'checkLatestIOSVersion - fetch ' + storeUrl,
        cause: error,
        location: 'AccountsScreen'
      })
    );
  } catch (err) {
    log({ description: 'checkLatestIOSVersion', cause: err, location: 'AccountsScreen'});
  }
};

const parseAndroidVersion = (html) => {
  let pattern = 'Current Version</div>';
    let index = html.indexOf(pattern);
    if(index > 0) {
      let startPos = index + pattern.length;
      var secondHalf = html.substring(startPos);
      let endPos = secondHalf.indexOf('</span>');
      startPos = endPos - 4;
      let version = secondHalf.substring(startPos, endPos);
      let appVersion = DeviceInfo.getVersion();
      //console.log('Play Store Version '+version+' vs. App Version '+appVersion);
      if(appVersion !== version) {
        Alert.alert(
          'New version available!',
          'Download latest version '+version+' of TRIBE Wallet from Play Store.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Update wallet cancelled'),
              style: 'cancel'
            },
            { text: 'OK', onPress: () => goToAppStore() }
          ],
          { cancelable: true }
        );
      }
    }
};

const checkLatestAndroidVersion = () => {
  let storeUrl = 'https://play.google.com/store/apps/details?id=com.kryptowallet';
  try {
    fetch(storeUrl, { method: 'GET' })
      .then(response => response.text())
      .then(text => parseAndroidVersion(text))
      .catch(error => log({
        description: 'checkLatestAndroidVersion - fetch ' + storeUrl,
        cause: error,
        location: 'AccountsScreen'
      })
    );
  } catch (err) {
    log({ description: 'checkLatestAndroidVersion', cause: err, location: 'AccountsScreen'});
  }
};

const checkOnLatestVersion = () => {
  let brand = DeviceInfo.getBrand();
  console.log("Device brand: "+brand);
  if (brand == "Apple") { // Either iPhone device
    checkLatestIOSVersion();
  } else { // otherwise - Android
    checkLatestAndroidVersion();
  }
};

if (runCount == 0) {
  setRunCount(1);
  checkOnLatestVersion();
}

  var optionalButtons = <View style={styles.spacer} />;
  if(algoAccounts.length == 0 && fioAccounts.length == 0) {
      optionalButtons = <View>
          <KButton title={'Register [address]@tribe'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>
          <KButton title={'Create Telos account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateTelosAccount}/>
          <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
        </View>;
  } else if(fioAccounts.length == 0) {
      optionalButtons = <KButton title={'Register [address]@tribe'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>;
  } else if(algoAccounts.length == 0) {
      optionalButtons = <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>;
  }


  if(accounts.length == 0) {
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
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <AccountListItem
            account={item}
            style={styles.listItem}
            onCheck={() => _handleCheckAccount(index)}
            onPress={() => _handlePressAccount(index)}
            checked={index === activeAccountIndex}
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
      <Text style={styles.version}>{getAppVersion()}</Text>
     </SafeAreaView>
    );
  }

};

export default connectAccounts()(AccountsScreen);
