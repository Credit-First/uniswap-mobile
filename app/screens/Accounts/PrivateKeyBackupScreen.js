import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Image, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KInput, KHeader, KButton } from '../../components';
import styles from './AccountsScreen.style';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const PrivateKeyBackupScreen = props => {

	const {
    navigation: { goBack },
    route: {
      params: { account },
    },
  } = props;

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
            <KInput
              		label={'Private Key'}
              		value={account.privateKey}
              		multiline={true}
              		containerStyle={styles.inputContainer}
              		editable={false}
            />
            <View style={styles.qrcode}>
            	<QRCode value={account.privateKey} size={300}/>
            </View>
            <KButton
            title={'Back to account'}
            theme={'primary'}
            style={styles.button}
            onPress={goBack}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(PrivateKeyBackupScreen);