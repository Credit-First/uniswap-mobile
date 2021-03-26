import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Text, Image, SafeAreaView, View, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';


const PrivateKeyBackupScreen = props => {

	const {
    navigation: { navigate, goBack },
    route: {
      params: { account },
    },
		accountsState: { accounts, addresses, keys, config },
  } = props;

const _handleDelegateKey = () => {
	navigate('PrivateKeyDelegate', { account });
}

var privateKey = (account.chainName==='ALGO') ? account.mnemonic : account.privateKey;

const copyToClipboard = () => {
	Clipboard.setString(privateKey);
	Alert.alert('Private key copied to Clipboard');
}

const getTitle = () => {
	if (account.chainName === 'FIO') {
		return account.address;
	} else {
		return account.accountName;
	}
};

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
            title={getTitle()}
            subTitle={account.chainName}
            style={styles.header}
          />
						<Text style={styles.link} onPress={copyToClipboard}>{privateKey}</Text>
						<View style={styles.spacer} />
            <View style={styles.qrcode}>
            	<QRCode value={privateKey} size={200}/>
            </View>
						<KButton
            	title={'Copy to Clipboard'}
            	theme={'brown'}
            	style={styles.button}
            	onPress={copyToClipboard}
          	/>
            <KButton
            	title={'Delegate to guardians'}
            	theme={'primary'}
            	style={styles.button}
            	onPress={_handleDelegateKey}
          	/>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  	);
	
};

export default connectAccounts()(PrivateKeyBackupScreen);
