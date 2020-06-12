import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get } from 'lodash';
import ecc from 'eosjs-ecc-rn';
import { fioAddPublicAddress } from '../../eos/eos';
import styles from './RegisterAddress.style';
import { KHeader, KInput, KText, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';


const FIOAddressActionsScreen = props => {
  const [fioRegistrationContent, setFioRegistrationContent] = useState();
  const [executionCount, setExecutionCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [buttonColor, setButtonColor] = useState('grey');
  const [fioBalance, setFioBalance] = useState(0.0);
  const [actor, setActor] = useState('4fzg3kyzplmn');
  const [fioFee, setFioFee] = useState(0);

  const {
  	route: {
      params: { action },
    },
    accountsState: { accounts },
    navigation: { goBack },
  } = props;

  const fioAccount = accounts[action];
  const privateKey = fioAccount.privateKey;
  const eosKey = ecc.privateToPublic(privateKey);
  const fioKey = 'FIO' + eosKey.substring(3);
  fioAccount.accountName = actor;


  const filteredAccounts = accounts.filter((value, index, array) => {
  	value.title = "Connect " + value.chainName + ": " + value.accountName;
    return (value.chainName != 'FIO');
  });

  const _handleConnectAccountToAddress = async (account) => {
  	const eosKey = ecc.privateToPublic(privateKey);
  	account.publicKey = eosKey;
  	try {
    	const res = await fioAddPublicAddress(fioAccount, account);
    	console.log('FIO add pubkey result', res);
	} catch (e) {
      Alert.alert(e.message);
    }
  };

  const checkRegistration = pubkey => {
  	if (executionCount > 0) {
  		return;
  	}
  	console.log("Check registration for "+pubkey);
  	setExecutionCount(1);
    fetch('http://fio.eostribe.io/v1/chain/get_fio_names', {
  			method: 'POST',
  			headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({
  				"fio_public_key": pubkey
  			})
		})
      	.then((response) => response.json())
      	.then((json) => updateFioRegistration(json.fio_addresses))
      	.catch((error) => console.log(error));
  };

  const getFioBalance = pubkey => {
    fetch('http://fio.eostribe.io/v1/chain/get_fio_balance', {
  			method: 'POST',
  			headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({
  				"fio_public_key": pubkey
  			})
		})
      	.then((response) => response.json())
      	.then((json) => setFioBalance(json.balance))
      	.catch((error) => console.error(error));
  };

  const getFee = address => {
    fetch('http://fio.eostribe.io/v1/chain/get_fee', {
  			method: 'POST',
  			headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({
  				"end_point": "add_pub_address",
  				"fio_address": address
  			})
		})
      	.then((response) => response.json())
      	.then((json) => setFioFee(json.fee))
      	.catch((error) => console.error(error));
  };

  const loadActor = pubkey => {
  	console.log("Load actor for " + pubkey);
	//TODO: replace endpoint with ours after upgrade:
    fetch('http://fio.eosusa.news/v1/chain/get_actor', {
  			method: 'POST',
  			headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({
  				"fio_public_key": pubkey
  			})
		})
      	.then((response) => response.json())
      	.then((json) => setActor(json.actor))
      	.catch((error) => console.error(error));
  };

  const updateFioRegistration = (fioAddresses) => {
  	if (fioAddresses) {
    	var content = fioAddresses.map(function (item) {
    		if (fioAccount.address != item.fio_address) {
    			fioAccount.address = item.fio_address;
    		}
        	return item.fio_address + " expires " + item.expiration;
     	});
     	setRegistered(true);
     	setButtonColor('primary');
    	setFioRegistrationContent(content);
    	getFioBalance(fioKey);
    	getFee(fioAccount.address);
    	//loadActor(fioKey);
	} else {
		setRegistered(false);
		setButtonColor('gray');
		setFioRegistrationContent("Unregistered address");
	}
  }

  const _checkRegister = () => {
      var registerUrl = 'https://reg.fioprotocol.io/ref/tribe?publicKey=' + fioKey;
      Linking.openURL(registerUrl);
  }

  const _removeFIOAddress = () => {
  	//deleteAccount(fioAccount);
  	console.log("TODO: Remove account");
  	goBack();
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
        <KHeader
          title={fioAccount.address}
          style={styles.header}
        />
        <KText>{fioKey}</KText>
        <KText>Actor: {actor}</KText>
        <KText>Balance: {fioBalance} FIO</KText>
        <KText>Connect fee: {fioFee} FIO</KText>
        <KText>{fioRegistrationContent}</KText>
        <View style={styles.spacer} />
        <KText>Connect any of imported accounts to the address:</KText>
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
        	onPress={_removeFIOAddress}
      	/>
       </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(FIOAddressActionsScreen);