import React, { useState } from 'react';
import { Image, View, FlatList, SafeAreaView, Linking, Text } from 'react-native';
import { KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import AccountListItem from './components/AccountListItem';
import algosdk from 'algosdk';
import { findIndex } from 'lodash';
import { log } from '../../logger/logger'


const AccountsScreen = props => {
  const {
    connectAccount,
    deleteAccount,
    navigation: { navigate },
    accountsState: { accounts, activeAccountIndex },
    chooseActiveAccount,
  } = props;

  const promoText = "Promotion: Register FREE FIO address and link to your new Algorand account and send FIO Request to promo@tribe for 100 ALGO. Include a link to a social media post about your experience with TRIBE Wallet in memo field. We will grant first 10 unique requests.";

  var initialConnectedAccounts = accounts;
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'FIO';
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return value.chainName === 'ALGO';
  });

  const updateAccountLists = (account) => {
      var newConnectedAccounts = [...initialConnectedAccounts , account ];
      initialConnectedAccounts.push(account);
      setConnectedAccounts(newConnectedAccounts);
  }

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

  const replacePendingFioAddress = (fioAddress, fioAccount) => {
    const privateKey = fioAccount.privateKey;
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
  };

  const updateFioRegistration = (json, account) => {
    console.log(json);
    let fioAddresses = json.fio_addresses;
    if (fioAddresses) {
      fioAddresses.map(function(item) {
        replacePendingFioAddress(item.fio_address, account);
      });
    } else {
      log({
        description: 'updateFioRegistration - missing registration info',
        cause: json,
        location: 'ActionsScreen'
      })
    }
  };

  const checkPendingFIOAddressRegistration = (account) => {
    const privateKey = account.privateKey;
    if (!privateKey) {
      log({
        description: 'checkPendingFIOAddressRegistration',
        cause: 'Pending FIO account with missing privateKey',
        location: 'ActionsScreen'
      });
      return;
    }
    const publicKey = Ecc.privateToPublic(privateKey);
    fetch('http://fio.greymass.com/v1/chain/get_fio_names', {
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
      .then(json => updateFioRegistration(json, account))
      .catch(error => log({
        description: 'checkPendingFIOAddressRegistration - fetch http://fio.greymass.com/v1/chain/get_fio_names ['+publicKey+']',
        cause: error,
        location: 'ActionsScreen'
      })
    );
  };

  const hasPendingFIOAddress = () => {
    let ret = false;
    fioAccounts.map((value, index, array) => {
      if (value.address === 'pending@tribe') {
        ret = true;
        checkPendingFIOAddressRegistration(value);
      }
    });
    return ret;
  }

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


  var optionalButtons = <View style={styles.spacer} />;
  if (!hasPendingFIOAddress()) {
    if(algoAccounts.length == 0 && fioAccounts.length == 0) {
      optionalButtons = <View>
          <KButton title={'Register [address]@tribe'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>
          <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>
        </View>;
    } else if(fioAccounts.length == 0) {
      optionalButtons = <KButton title={'Register [address]@tribe'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleRegisterAddress}/>;
    } else if(algoAccounts.length == 0) {
      optionalButtons = <KButton title={'Create Algorand account'} theme={'brown'} style={styles.button} icon={'add'} onPress={_handleCreateAlgorandAccount}/>;
    }
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
      <Text style={styles.promo}>{promoText}</Text>
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
     </SafeAreaView>
    );
  }

};

export default connectAccounts()(AccountsScreen);
