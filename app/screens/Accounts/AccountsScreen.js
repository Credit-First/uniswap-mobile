import React, { useState } from 'react';
import { Image, View, FlatList, SafeAreaView, Linking, Text } from 'react-native';
import { KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import ecc from 'eosjs-ecc-rn';
import AccountListItem from './components/AccountListItem';
import algosdk from 'algosdk';


const AccountsScreen = props => {
  const {
    connectAccount,
    navigation: { navigate },
    accountsState: { accounts, activeAccountIndex },
    chooseActiveAccount,
  } = props;

  const promoText = "Promotion: Register FREE FIO address and link to your new Algorand account and send FIO Request to promo@tribe for 100 ALGO. Include a link to a social media post about your experience with TRIBE Wallet in memo field. We will grant first 10 unique requests.";

  var initialConnectedAccounts = accounts;
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);

  const fioAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'FIO';
  });

  const algoAccounts = accounts.filter((value, index, array) => {
    return value.chainName == 'ALGO';
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
    ecc.randomKey().then(privateKey => {
      const fioKey = Ecc.privateToPublic(privateKey);
      const address = 'pending@tribe';
      connectAccount({ address, privateKey, chainName: 'FIO' });
      var registerUrl =
        'https://reg.fioprotocol.io/ref/tribe?publicKey=' + fioKey;
      Linking.openURL(registerUrl);
    });
  };

  const hasPendingFIOAddress = () => {
    let ret = false;
    fioAccounts.map((value, index, array) => {
      if (value.address === 'pending@tribe') {
        ret = true;
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
