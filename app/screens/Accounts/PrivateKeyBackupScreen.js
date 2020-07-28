import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Text, Image, SafeAreaView, View, TouchableOpacity, Clipboard } from 'react-native';
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
  } = props;

const _handleDelegateKey = () => {
	navigate('PrivateKeyDelegate', { account });
}

var privateKey = (account.chainName==='ALGO') ? account.mnemonic : account.privateKey;

const copyToClipboard = () => {
	Clipboard.setString(privateKey);
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
