import React from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { get } from 'lodash';
import moment from 'moment';

import styles from './TransactionDetailScreen.style';
import { KHeader, KInput } from '../../components';
import { connectAccounts } from '../../redux';
import { PRIMARY_BLUE } from '../../theme/colors';

const ConnectAccountScreen = props => {
  const {
    navigation: { goBack },
    route: {
      params: { action },
    },
    accountsState: { accounts, activeAccountIndex },
  } = props;

  const activeAccount = accounts[activeAccountIndex];
  const data = get(action, 'act.data');
  const isSent = data.from === activeAccount.accountName;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
        <View style={styles.content}>
          <KHeader
            title={'Transaction details'}
            subTitle={'A detailed screen of the transactions.'}
            style={styles.header}
          />
          <KInput
            label={isSent ? 'Sent to' : 'Sent from'}
            placeholder={''}
            value={isSent ? data.to : data.from}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={false}
          />
          <KInput
            label={isSent ? 'Amount sent' : 'Amount received'}
            placeholder={''}
            value={data.quantity}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={false}
          />
          <KInput
            label={'Date'}
            placeholder={''}
            value={moment(action.block_timestamp).format(
              'MMM DD, YYYY hh:mm:ss A',
            )}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={false}
          />
          <KInput
            label={'Personal note'}
            placeholder={''}
            value={data.memo}
            containerStyle={styles.inputContainer}
            autoCapitalize={'none'}
            editable={false}
          />
          {/* <KInput
            label={'Private Key'}
            placeholder={'Enter your private key'}
            secureTextEntry
            value={privateKey}
            onChangeText={setPrivateKey}
            containerStyle={styles.inputContainer}
          /> */}
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(ConnectAccountScreen);
