import React, { useState } from 'react';
import { Image, SafeAreaView, View, TouchableOpacity, Alert, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KSelect, KButton, KText } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';
import { Fio, Ecc } from '@fioprotocol/fiojs';
import { fioDelegateSecretRequest } from '../../eos/fio';
import CryptoJS from "react-native-crypto-js";
import algosdk from 'algosdk';

const PrivateKeyDelegateScreen = props => {

	const {
    navigation: { goBack },
    route: {
      params: { account },
    },
		accountsState: { accounts },
  } = props;

const [fromAccount, setFromAccount] = useState();
const [email, setEmail] = useState();
const [password, setPassword] = useState();

const adminPubkey = "FIO5ESppRYY3WVounFLTP9j3an5CwhSTxaJScKoeCNZ5PQHsyKYe5";
let privateKey = account.privateKey;
if (account.chainName === 'ALGO') {
	let algoAccount = algosdk.mnemonicToSecretKey(account.mnemonic);
	privateKey = new Buffer(algoAccount.sk).toString("base64");
}

const fioAccounts = accounts.filter((value, index, array) => {
	return value.chainName == 'FIO';
});

const _delegateKey = async () => {
	if (!fromAccount || !email || !password) {
		Alert.alert("Please fill all fields on this form.");
		return;
	}
	let encryptedKey = CryptoJS.AES.encrypt(privateKey, password).toString();
	try {
		const res = await fioDelegateSecretRequest(fromAccount,
			'admin@tribe',
			adminPubkey,
			account.chainName,
			email,
			encryptedKey,
			0);
		if (res && res.transaction_id) {
			Alert.alert("Private key encrypted and delegated to admin@tribe! in tx "+res.transaction_id);
		} else {
			Alert.alert("Something went wrong: "+res.message);
		}
	} catch (err) {
		Alert.alert(err.message);
	}
}

return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.inner}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
          <KHeader
            title={account.accountName}
            subTitle={account.chainName}
            style={styles.header}
          />
					<View style={styles.spacer} />
					<KText>1. Your private key will be encrypted using password you supply below.
					We will not save your password - so make sure you will remember it!</KText>
					<KText>2. Your encrypted private key alone with email will be double encrypted by admin@tribe public key.</KText>
					<KText>3. Recovery of private key will be handled over email with instructions provided on request.</KText>
					<KText>4. You will need your password to ultimately decrypt and gain access to your original private key.</KText>
          <View style={styles.spacer} />
						<KSelect
							label={'FIO address'}
							placeholder={'Your originating FIO address for this request'}
							items={fioAccounts.map(item => ({
								label: `${item.chainName}: ${item.address}`,
								value: item,
							}))}
							onValueChange={setFromAccount}
							containerStyle={styles.inputContainer}
						/>
						<KInput
							label={'Email'}
							placeholder={'Enter your contact email to be used for recovery'}
							value={email}
							onChangeText={setEmail}
							containerStyle={styles.inputContainer}
							autoCapitalize={'none'}
						/>
            <KInput
							label={'Password'}
							placeholder={'Enter encryption password you will remember'}
							value={password}
							secureTextEntry
							onChangeText={setPassword}
							containerStyle={styles.inputContainer}
							autoCapitalize={'none'}
            />
						<View style={styles.spacer} />
            <KButton
            	title={'Delegate to admin@tribe'}
            	theme={'primary'}
            	style={styles.button}
            	onPress={_delegateKey}
          	/>
						<View style={styles.spacer} />
						<KText>Disclaimer: This service is optional and provides relatively safe key backup and recovery mechanism.</KText>
						<KText>However for high balance and high risk accounts we recommend using offline hardware keys.</KText>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(PrivateKeyDelegateScreen);
