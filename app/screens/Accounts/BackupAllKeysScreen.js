import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Text, Image, SafeAreaView, View, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';


const BackupAllKeysScreen = props => {

	const {
    navigation: { navigate, goBack },
		accountsState: { accounts },
  } = props;


	var privateKeys = '';
	accounts.map((value, index, array) => {
    var chainName = (value.chainName  == "Telos") ? "TLOS" : value.chainName;
		var accountName = (chainName==='FIO') ? value.address : value.accountName;
    var privateKey = (chainName==='ALGO') ? value.mnemonic : value.privateKey;
		privateKeys += accountName+':'+privateKey+',';
  });

const copyToClipboard = () => {
	Clipboard.setString(privateKeys);
	Alert.alert('Private keys copied to Clipboard');
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
          <KHeader  title={'Backup all private keys'}  style={styles.header}/>
						<Text style={styles.link} onPress={copyToClipboard}>{privateKeys}</Text>
						<View style={styles.spacer} />
						<KButton
            	title={'Copy to Clipboard'}
            	theme={'brown'}
            	style={styles.button}
            	onPress={copyToClipboard}
          	/>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(BackupAllKeysScreen);
